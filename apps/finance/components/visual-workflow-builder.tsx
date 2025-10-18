"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Play,
  Save,
  Settings,
  User,
  CheckCircle,
  Mail,
  GitBranch,
  Zap,
  Trash2,
  Eye,
  Copy,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Link2,
  Workflow,
  Clock,
  AlertCircle,
  CheckSquare,
  Edit,
  X,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "start" | "approval" | "condition" | "notification" | "action" | "end";
  position: { x: number; y: number };
  data: {
    title: string;
    description?: string;
    approver?: string;
    condition?: string;
    message?: string;
    action?: string;
    timeout?: string;
    notificationType?: string;
    [key: string]: any;
  };
  connections: string[];
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromHandle: string;
  toHandle: string;
  label?: string;
  condition?: string;
}

interface ContextMenu {
  x: number;
  y: number;
  nodeId?: string;
  connectionId?: string;
}

const nodeTypes = [
  {
    type: "start",
    icon: Play,
    label: "Start",
    color: "bg-emerald-500",
    description: "Workflow trigger point",
    category: "trigger",
    details: "Initiates the approval workflow when an expense is submitted",
  },
  {
    type: "approval",
    icon: User,
    label: "Approval",
    color: "bg-blue-500",
    description: "Requires approval from user",
    category: "action",
    details: "Routes expense to designated approver for review and decision",
  },
  {
    type: "condition",
    icon: GitBranch,
    label: "Condition",
    color: "bg-amber-500",
    description: "Conditional logic branch",
    category: "logic",
    details: "Evaluates conditions to determine workflow path",
  },
  {
    type: "notification",
    icon: Mail,
    label: "Notification",
    color: "bg-purple-500",
    description: "Send notification",
    category: "action",
    details: "Sends email, Slack, or Teams notifications to stakeholders",
  },
  {
    type: "action",
    icon: Zap,
    label: "Action",
    color: "bg-orange-500",
    description: "Execute automated action",
    category: "action",
    details:
      "Performs automated tasks like updating records or triggering integrations",
  },
  {
    type: "end",
    icon: CheckCircle,
    label: "End",
    color: "bg-slate-500",
    description: "Workflow completion",
    category: "trigger",
    details: "Marks the completion of the approval workflow",
  },
];

export function VisualWorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "start-1",
      type: "start",
      position: { x: 100, y: 200 },
      data: { title: "Expense Submitted" },
      connections: [],
    },
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{
    nodeId: string;
    handle: string;
    position: { x: number; y: number };
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [workflowName, setWorkflowName] = useState("New Approval Workflow");
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePosition({
          x: (e.clientX - rect.left - panOffset.x) / zoom,
          y: (e.clientY - rect.top - panOffset.y) / zoom,
        });
      }
    };

    const handleClick = () => {
      setContextMenu(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
    };
  }, [zoom, panOffset]);

  const handleNodeDrag = useCallback(
    (nodeId: string, newPosition: { x: number; y: number }) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId ? { ...node, position: newPosition } : node
        )
      );
    },
    []
  );

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    setSelectedNode(node);
    setSelectedConnection(null);
  }, []);

  const addNode = useCallback((type: WorkflowNode["type"]) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 300 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: {
        title: nodeTypes.find((nt) => nt.type === type)?.label || type,
        description: "",
      },
      connections: [],
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode);
  }, []);

  const duplicateNode = useCallback(
    (nodeId: string) => {
      const nodeToDuplicate = nodes.find((n) => n.id === nodeId);
      if (nodeToDuplicate) {
        const newNode: WorkflowNode = {
          ...nodeToDuplicate,
          id: `${nodeToDuplicate.type}-${Date.now()}`,
          position: {
            x: nodeToDuplicate.position.x + 50,
            y: nodeToDuplicate.position.y + 50,
          },
          connections: [],
          data: {
            ...nodeToDuplicate.data,
            title: `${nodeToDuplicate.data.title} (Copy)`,
          },
        };
        setNodes((prev) => [...prev, newNode]);
        setSelectedNode(newNode);
      }
      setContextMenu(null);
    },
    [nodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      if (nodes.length <= 1) return;

      setNodes((prev) => prev.filter((node) => node.id !== nodeId));
      setConnections((prev) =>
        prev.filter((conn) => conn.from !== nodeId && conn.to !== nodeId)
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
      setContextMenu(null);
    },
    [selectedNode, nodes.length]
  );

  const deleteConnection = useCallback((connectionId: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
    setSelectedConnection(null);
    setContextMenu(null);
  }, []);

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) =>
          prev ? { ...prev, data: { ...prev.data, ...data } } : null
        );
      }
    },
    [selectedNode]
  );

  const startConnection = useCallback(
    (nodeId: string, handle: string, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();
      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        const position =
          handle === "right"
            ? { x: node.position.x + 200, y: node.position.y + 40 }
            : { x: node.position.x, y: node.position.y + 40 };
        setConnecting({ nodeId, handle, position });
      }
    },
    [nodes]
  );

  const completeConnection = useCallback(
    (toNodeId: string, toHandle: string, event: React.MouseEvent) => {
      event.stopPropagation();
      event.preventDefault();

      if (connecting && connecting.nodeId !== toNodeId) {
        const existingConnection = connections.find(
          (conn) => conn.from === connecting.nodeId && conn.to === toNodeId
        );

        if (!existingConnection) {
          const newConnection: Connection = {
            id: `${connecting.nodeId}-${toNodeId}-${Date.now()}`,
            from: connecting.nodeId,
            to: toNodeId,
            fromHandle: connecting.handle,
            toHandle: toHandle,
            label: "Success",
          };
          setConnections((prev) => [...prev, newConnection]);

          setNodes((prev) =>
            prev.map((node) => {
              if (node.id === connecting.nodeId) {
                return {
                  ...node,
                  connections: [...node.connections, toNodeId],
                };
              }
              return node;
            })
          );
        }
      }
      setConnecting(null);
    },
    [connecting, connections]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, nodeId?: string, connectionId?: string) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        nodeId,
        connectionId,
      });
    },
    []
  );

  const NodeComponent = ({ node }: { node: WorkflowNode }) => {
    const nodeType = nodeTypes.find((nt) => nt.type === node.type);
    const Icon = nodeType?.icon || Play;
    const isSelected = selectedNode?.id === node.id;
    const isHovered = hoveredNode === node.id;
    const isConnecting = connecting?.nodeId === node.id;

    return (
      <div
        className={`absolute bg-white border-2 rounded-xl shadow-lg cursor-move transition-all duration-300 hover:shadow-2xl group min-w-[200px] ${
          isSelected
            ? "border-blue-500 ring-4 ring-blue-200 shadow-2xl"
            : "border-gray-200"
        } ${isHovered && !isSelected ? "border-gray-300 shadow-xl" : ""} ${
          isConnecting ? "ring-2 ring-green-300" : ""
        }`}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${isSelected ? 1.02 : 1})`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeClick(node);
        }}
        onContextMenu={(e) => handleContextMenu(e, node.id)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        onMouseDown={(e) => {
          if (
            e.button === 0 &&
            (e.target === e.currentTarget ||
              (e.target as HTMLElement).closest(".node-content"))
          ) {
            setDraggedNode(node.id);
            const rect = e.currentTarget.getBoundingClientRect();
            setDragOffset({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            });
          }
        }}
      >
        {/* Left connection handle */}
        <div
          className={`absolute -left-3 top-1/2 w-6 h-6 rounded-full border-2 border-white cursor-crosshair transition-all duration-200 shadow-lg z-10 bg-blue-500 hover:bg-blue-600 hover:scale-110 ${
            connecting && connecting.nodeId !== node.id
              ? "ring-2 ring-green-400 animate-pulse"
              : ""
          }`}
          style={{ transform: "translateY(-50%)" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (connecting) {
              completeConnection(node.id, "left", e);
            } else {
              startConnection(node.id, "left", e);
            }
          }}
        />

        {/* Right connection handle */}
        <div
          className={`absolute -right-3 top-1/2 w-6 h-6 rounded-full border-2 border-white cursor-crosshair transition-all duration-200 shadow-lg z-10 bg-blue-500 hover:bg-blue-600 hover:scale-110 ${
            connecting && connecting.nodeId !== node.id
              ? "ring-2 ring-green-400 animate-pulse"
              : ""
          }`}
          style={{ transform: "translateY(-50%)" }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (connecting) {
              completeConnection(node.id, "right", e);
            } else {
              startConnection(node.id, "right", e);
            }
          }}
        />

        <div className="p-5 node-content">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`p-3 rounded-xl text-white shadow-lg ${nodeType?.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-800">
                {node.data.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {nodeType?.description}
              </p>
            </div>
          </div>
          {node.data.description && (
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">
              {node.data.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-3">
            {node.connections.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                <Link2 className="w-3 h-3 mr-1" />
                {node.connections.length}
              </span>
            )}
            {node.type === "approval" && node.data.approver && (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs border border-gray-300 text-gray-700">
                {node.data.approver}
              </span>
            )}
          </div>
        </div>

        {isConnecting && (
          <div className="absolute inset-0 border-2 border-green-400 rounded-xl animate-pulse pointer-events-none" />
        )}
      </div>
    );
  };

  const ConnectionLine = ({ connection }: { connection: Connection }) => {
    const fromNode = nodes.find((n) => n.id === connection.from);
    const toNode = nodes.find((n) => n.id === connection.to);

    if (!fromNode || !toNode) return null;

    const fromX = fromNode.position.x + 200;
    const fromY = fromNode.position.y + 40;
    const toX = toNode.position.x;
    const toY = toNode.position.y + 40;

    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;
    const isSelected = selectedConnection?.id === connection.id;

    return (
      <g>
        <path
          d={`M ${fromX} ${fromY} C ${midX} ${fromY} ${midX} ${toY} ${toX} ${toY}`}
          stroke={isSelected ? "#3b82f6" : "#6b7280"}
          strokeWidth={isSelected ? "3" : "2"}
          fill="none"
          markerEnd="url(#arrowhead)"
          className="cursor-pointer hover:stroke-blue-500 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedConnection(connection);
            setSelectedNode(null);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            handleContextMenu(e as any, undefined, connection.id);
          }}
        />

        {connection.label && (
          <g>
            <rect
              x={midX - 30}
              y={midY - 12}
              width="60"
              height="24"
              rx="12"
              fill="white"
              stroke={isSelected ? "#3b82f6" : "#d1d5db"}
              strokeWidth="2"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedConnection(connection);
                setSelectedNode(null);
              }}
            />
            <text
              x={midX}
              y={midY + 4}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium pointer-events-none"
              style={{ fontSize: "11px" }}
            >
              {connection.label}
            </text>
          </g>
        )}
      </g>
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedNode && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const newPosition = {
          x: (e.clientX - rect.left - dragOffset.x - panOffset.x) / zoom,
          y: (e.clientY - rect.top - dragOffset.y - panOffset.y) / zoom,
        };
        handleNodeDrag(draggedNode, newPosition);
      }
    };

    const handleMouseUp = () => {
      setDraggedNode(null);
      setConnecting(null);
    };

    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedNode, dragOffset, handleNodeDrag, zoom, panOffset]);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.nodeId && (
            <>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  const node = nodes.find((n) => n.id === contextMenu.nodeId);
                  if (node) setSelectedNode(node);
                  setContextMenu(null);
                }}
              >
                <Edit className="w-4 h-4" />
                Edit Properties
              </button>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => duplicateNode(contextMenu.nodeId!)}
              >
                <Copy className="w-4 h-4" />
                Duplicate Node
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                onClick={() => deleteNode(contextMenu.nodeId!)}
                disabled={nodes.length <= 1}
              >
                <Trash2 className="w-4 h-4" />
                Delete Node
              </button>
            </>
          )}
          {contextMenu.connectionId && (
            <>
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                onClick={() => {
                  const conn = connections.find(
                    (c) => c.id === contextMenu.connectionId
                  );
                  if (conn) setSelectedConnection(conn);
                  setContextMenu(null);
                }}
              >
                <Edit className="w-4 h-4" />
                Edit Connection
              </button>
              <div className="border-t border-gray-200 my-1" />
              <button
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                onClick={() => deleteConnection(contextMenu.connectionId!)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Connection
              </button>
            </>
          )}
        </div>
      )}

      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Workflow Builder
              </h2>
              <p className="text-sm text-gray-600">
                Design approval workflows visually
              </p>
            </div>
          </div>
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-full mb-4 px-3 py-2 border border-blue-200 rounded-md focus:border-blue-400 focus:outline-none"
            placeholder="Enter workflow name"
          />
          <div className="flex gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
            <button className="px-3 py-2 border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-md text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              Add Nodes
            </h3>
            <div className="space-y-4">
              {["trigger", "action", "logic"].map((category) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-600 mb-3 capitalize flex items-center gap-2">
                    {category === "trigger" && <Play className="w-3 h-3" />}
                    {category === "action" && <Zap className="w-3 h-3" />}
                    {category === "logic" && <GitBranch className="w-3 h-3" />}
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {nodeTypes
                      .filter((nt) => nt.category === category)
                      .map((nodeType) => {
                        const Icon = nodeType.icon;
                        return (
                          <button
                            key={nodeType.type}
                            className="w-full p-3 flex items-start gap-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all duration-200 text-left"
                            onClick={() => addNode(nodeType.type)}
                          >
                            <div
                              className={`p-2 rounded-lg text-white shadow-sm shrink-0 ${nodeType.color}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-800">
                                {nodeType.label}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {nodeType.details}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4">
            <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Properties
            </h3>
            {selectedNode ? (
              <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200">
                  <div
                    className={`p-2 rounded-lg text-white shadow-sm shrink-0 ${nodeTypes.find((nt) => nt.type === selectedNode.type)?.color}`}
                  >
                    {(() => {
                      const Icon =
                        nodeTypes.find((nt) => nt.type === selectedNode.type)
                          ?.icon || Settings;
                      return <Icon className="w-4 h-4" />;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800">
                      {selectedNode.data.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {
                        nodeTypes.find((nt) => nt.type === selectedNode.type)
                          ?.description
                      }
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2 mb-1">
                      <AlertCircle className="w-3 h-3" />
                      Title
                    </label>
                    <input
                      type="text"
                      value={selectedNode.data.title}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, {
                          title: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Description
                    </label>
                    <textarea
                      value={selectedNode.data.description || ""}
                      onChange={(e) =>
                        updateNodeData(selectedNode.id, {
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Add a description for this node..."
                    />
                  </div>

                  {selectedNode.type === "approval" && (
                    <div className="border-t border-gray-200 pt-3">
                      <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-3">
                        <User className="w-3 h-3" />
                        Approval Settings
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Approver
                          </label>
                          <select
                            value={selectedNode.data.approver || ""}
                            onChange={(e) =>
                              updateNodeData(selectedNode.id, {
                                approver: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          >
                            <option value="">Select approver</option>
                            <option value="manager">Direct Manager</option>
                            <option value="finance">Finance Team</option>
                            <option value="ceo">CEO</option>
                            <option value="custom">Custom User</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium flex items-center gap-2 mb-1">
                            <Clock className="w-3 h-3" />
                            Timeout (hours)
                          </label>
                          <input
                            type="number"
                            value={selectedNode.data.timeout || "24"}
                            onChange={(e) =>
                              updateNodeData(selectedNode.id, {
                                timeout: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            min="1"
                            max="168"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedNode.type === "condition" && (
                    <div className="border-t border-gray-200 pt-3">
                      <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-3">
                        <GitBranch className="w-3 h-3" />
                        Condition Settings
                      </h5>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Condition Type
                        </label>
                        <select
                          value={selectedNode.data.condition || ""}
                          onChange={(e) =>
                            updateNodeData(selectedNode.id, {
                              condition: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select condition</option>
                          <option value="amount">Amount greater than</option>
                          <option value="category">Category equals</option>
                          <option value="department">Department equals</option>
                          <option value="custom">Custom condition</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedNode.type === "notification" && (
                    <div className="border-t border-gray-200 pt-3">
                      <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2 mb-3">
                        <Mail className="w-3 h-3" />
                        Notification Settings
                      </h5>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Type
                          </label>
                          <select
                            value={
                              selectedNode.data.notificationType || "email"
                            }
                            onChange={(e) =>
                              updateNodeData(selectedNode.id, {
                                notificationType: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                          >
                            <option value="email">Email</option>
                            <option value="slack">Slack</option>
                            <option value="teams">Microsoft Teams</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Message Template
                          </label>
                          <textarea
                            value={selectedNode.data.message || ""}
                            onChange={(e) =>
                              updateNodeData(selectedNode.id, {
                                message: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter notification message template..."
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : selectedConnection ? (
              <div className="p-4 border border-purple-100 bg-purple-50/30 rounded-lg">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-purple-200">
                  <div className="p-2 rounded-lg bg-purple-500 text-white shadow-sm">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      Connection Settings
                    </h4>
                    <p className="text-xs text-gray-600">
                      Configure connection behavior
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Connection Label
                    </label>
                    <input
                      type="text"
                      value={selectedConnection.label || ""}
                      onChange={(e) => {
                        setConnections((prev) =>
                          prev.map((conn) =>
                            conn.id === selectedConnection.id
                              ? { ...conn, label: e.target.value }
                              : conn
                          )
                        );
                        setSelectedConnection((prev) =>
                          prev ? { ...prev, label: e.target.value } : null
                        );
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Success, Approved, Rejected"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Condition
                    </label>
                    <textarea
                      value={selectedConnection.condition || ""}
                      onChange={(e) => {
                        setConnections((prev) =>
                          prev.map((conn) =>
                            conn.id === selectedConnection.id
                              ? { ...conn, condition: e.target.value }
                              : conn
                          )
                        );
                        setSelectedConnection((prev) =>
                          prev ? { ...prev, condition: e.target.value } : null
                        );
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                      placeholder="Define when this connection should be taken"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800 mb-1">No Selection</h4>
                <p className="text-sm text-gray-500">
                  Select a node or connection to edit its properties
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative"
          style={{
            backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
          }}
          onClick={() => {
            setSelectedNode(null);
            setSelectedConnection(null);
          }}
          onContextMenu={(e) => handleContextMenu(e)}
        >
          {/* SVG Layer for connections - positioned absolutely */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <polygon points="0 0, 10 5, 0 10" fill="#6b7280" />
              </marker>
              <marker
                id="arrowhead-selected"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="5"
                orient="auto"
              >
                <polygon points="0 0, 10 5, 0 10" fill="#3b82f6" />
              </marker>
            </defs>

            <g style={{ pointerEvents: "auto" }}>
              {/* Render all connections */}
              {connections.map((connection) => (
                <ConnectionLine key={connection.id} connection={connection} />
              ))}

              {/* Preview line while connecting */}
              {connecting && (
                <line
                  x1={connecting.position.x}
                  y1={connecting.position.y}
                  x2={mousePosition.x}
                  y2={mousePosition.y}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  fill="none"
                  className="pointer-events-none"
                />
              )}
            </g>
          </svg>

          {/* Nodes Layer - positioned absolutely */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                pointerEvents: "auto",
              }}
            >
              {nodes.map((node) => (
                <NodeComponent key={node.id} node={node} />
              ))}
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <div className="flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <button
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded flex items-center justify-center"
              onClick={() => handleZoom(0.1)}
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded flex items-center justify-center"
              onClick={() => handleZoom(-0.1)}
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 p-0 hover:bg-gray-100 rounded flex items-center justify-center"
              onClick={resetView}
              title="Reset view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
          <button className="px-3 py-2 bg-white border border-gray-200 shadow-lg rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-md text-sm font-medium flex items-center gap-2">
            <Play className="w-4 h-4" />
            Test Workflow
          </button>
        </div>

        {/* Status bar */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-sm z-10">
          <div className="px-3 py-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white border border-gray-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                {nodes.length} nodes
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white border border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                {connections.length} connections
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-white border border-gray-200">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                {Math.round(zoom * 100)}% zoom
              </span>
              {selectedNode && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {selectedNode.data.title} selected
                </span>
              )}
              {selectedConnection && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                  Connection selected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Instructions overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs z-10">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">
            Quick Guide
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Click connection handles (blue dots) to connect nodes</li>
            <li>• Right-click on nodes/connections for more options</li>
            <li>• Drag nodes to reposition them</li>
            <li>• Click nodes/connections to edit properties</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
