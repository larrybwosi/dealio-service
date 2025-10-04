"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@repo/ui/select"
import { Textarea } from "@repo/ui/textarea"
import { Badge } from "@repo/ui/badge"
import { ScrollArea } from "@repo/ui/scroll-area"
import { Card } from "@repo/ui/card"
import { Separator } from "@repo/ui/separator"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WorkflowNode {
  id: string
  type: "start" | "approval" | "condition" | "notification" | "action" | "end"
  position: { x: number; y: number }
  data: {
    title: string
    description?: string
    approver?: string
    condition?: string
    message?: string
    action?: string
    [key: string]: any
  }
  connections: string[]
}

interface Connection {
  id: string
  from: string
  to: string
  fromHandle: string
  toHandle: string
  label?: string
  condition?: string
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
    details: "Performs automated tasks like updating records or triggering integrations",
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
]

export function VisualWorkflowBuilder() {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "start-1",
      type: "start",
      position: { x: 100, y: 200 },
      data: { title: "Expense Submitted" },
      connections: [],
    },
  ])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [connecting, setConnecting] = useState<{
    nodeId: string
    handle: string
    position: { x: number; y: number }
  } | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [workflowName, setWorkflowName] = useState("New Approval Workflow")
  const [zoom, setZoom] = useState(1)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setMousePosition({
          x: (e.clientX - rect.left - panOffset.x) / zoom,
          y: (e.clientY - rect.top - panOffset.y) / zoom,
        })
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    return () => document.removeEventListener("mousemove", handleMouseMove)
  }, [zoom, panOffset])

  const handleNodeDrag = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, position: newPosition } : node)))
  }, [])

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    setSelectedNode(node)
    setSelectedConnection(null)
  }, [])

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
    }
    setNodes((prev) => [...prev, newNode])
    setSelectedNode(newNode)
  }, [])

  const duplicateNode = useCallback(
    (nodeId: string, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }
      const nodeToDuplicate = nodes.find((n) => n.id === nodeId)
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
        }
        setNodes((prev) => [...prev, newNode])
        setSelectedNode(newNode)
      }
    },
    [nodes],
  )

  const deleteNode = useCallback(
    (nodeId: string, event?: React.MouseEvent) => {
      if (event) {
        event.stopPropagation()
        event.preventDefault()
      }
      // Prevent deleting if it's the only node
      if (nodes.length <= 1) return

      setNodes((prev) => prev.filter((node) => node.id !== nodeId))
      setConnections((prev) => prev.filter((conn) => conn.from !== nodeId && conn.to !== nodeId))
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null)
      }
    },
    [selectedNode, nodes.length],
  )

  const deleteConnection = useCallback((connectionId: string) => {
    setConnections((prev) => prev.filter((conn) => conn.id !== connectionId))
    setSelectedConnection(null)
  }, [])

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<WorkflowNode["data"]>) => {
      setNodes((prev) => prev.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node)))
      if (selectedNode?.id === nodeId) {
        setSelectedNode((prev) => (prev ? { ...prev, data: { ...prev.data, ...data } } : null))
      }
    },
    [selectedNode],
  )

  const startConnection = useCallback(
    (nodeId: string, handle: string, event: React.MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()
      const node = nodes.find((n) => n.id === nodeId)
      if (node) {
        const position =
          handle === "right"
            ? { x: node.position.x + 200, y: node.position.y + 40 }
            : { x: node.position.x, y: node.position.y + 40 }
        setConnecting({ nodeId, handle, position })
      }
    },
    [nodes],
  )

  const completeConnection = useCallback(
    (toNodeId: string, toHandle: string, event: React.MouseEvent) => {
      event.stopPropagation()
      event.preventDefault()

      if (connecting && connecting.nodeId !== toNodeId) {
        // Check if connection already exists
        const existingConnection = connections.find((conn) => conn.from === connecting.nodeId && conn.to === toNodeId)

        if (!existingConnection) {
          const newConnection: Connection = {
            id: `${connecting.nodeId}-${toNodeId}-${Date.now()}`,
            from: connecting.nodeId,
            to: toNodeId,
            fromHandle: connecting.handle,
            toHandle: toHandle,
            label: "Success",
          }
          setConnections((prev) => [...prev, newConnection])

          // Update node connections
          setNodes((prev) =>
            prev.map((node) => {
              if (node.id === connecting.nodeId) {
                return { ...node, connections: [...node.connections, toNodeId] }
              }
              return node
            }),
          )
        }
      }
      setConnecting(null)
    },
    [connecting, connections],
  )

  const NodeComponent = ({ node }: { node: WorkflowNode }) => {
    const nodeType = nodeTypes.find((nt) => nt.type === node.type)
    const Icon = nodeType?.icon || Play
    const isSelected = selectedNode?.id === node.id
    const isHovered = hoveredNode === node.id
    const isConnecting = connecting?.nodeId === node.id

    return (
      <div
        className={cn(
          "absolute bg-white border-2 rounded-xl shadow-lg cursor-move transition-all duration-300 hover:shadow-2xl group",
          isSelected ? "border-blue-500 ring-4 ring-blue-200 shadow-2xl" : "border-gray-200",
          isHovered && !isSelected ? "border-gray-300 shadow-xl" : "",
          isConnecting ? "ring-2 ring-green-300" : "",
          "min-w-[200px] backdrop-blur-xs",
        )}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: `scale(${isSelected ? 1.02 : 1})`,
        }}
        onClick={(e) => {
          e.stopPropagation()
          handleNodeClick(node)
        }}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".node-content")) {
            setDraggedNode(node.id)
            const rect = e.currentTarget.getBoundingClientRect()
            setDragOffset({
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            })
          }
        }}
      >
        <div
          className={cn(
            "absolute -left-3 top-1/2 w-6 h-6 rounded-full border-3 border-white cursor-crosshair transition-all duration-200 shadow-lg z-10",
            "bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600",
            connecting && connecting.nodeId !== node.id ? "ring-2 ring-green-400 animate-pulse" : "",
            "hover:scale-110",
          )}
          style={{ transform: "translateY(-50%)" }}
          onClick={(e) => {
            if (connecting) {
              completeConnection(node.id, "left", e)
            } else {
              startConnection(node.id, "left", e)
            }
          }}
        >
          <div className="w-full h-full rounded-full bg-white opacity-30" />
        </div>
        <div
          className={cn(
            "absolute -right-3 top-1/2 w-6 h-6 rounded-full border-3 border-white cursor-crosshair transition-all duration-200 shadow-lg z-10",
            "bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600",
            connecting && connecting.nodeId !== node.id ? "ring-2 ring-green-400 animate-pulse" : "",
            "hover:scale-110",
          )}
          style={{ transform: "translateY(-50%)" }}
          onClick={(e) => {
            if (connecting) {
              completeConnection(node.id, "right", e)
            } else {
              startConnection(node.id, "right", e)
            }
          }}
        >
          <div className="w-full h-full rounded-full bg-white opacity-30" />
        </div>

        <div className="p-5 node-content">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("p-3 rounded-xl text-white shadow-lg", nodeType?.color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-gray-800">{node.data.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{nodeType?.description}</p>
            </div>
          </div>
          {node.data.description && (
            <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg">{node.data.description}</p>
          )}

          <div className="flex items-center gap-2 mt-3">
            {node.connections.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Link2 className="w-3 h-3 mr-1" />
                {node.connections.length}
              </Badge>
            )}
            {node.type === "approval" && node.data.approver && (
              <Badge variant="outline" className="text-xs">
                {node.data.approver}
              </Badge>
            )}
          </div>
        </div>

        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
          <Button
            size="sm"
            variant="outline"
            className="w-8 h-8 p-0 bg-white shadow-lg hover:bg-blue-50 border-blue-200"
            onClick={(e) => duplicateNode(node.id, e)}
            title="Duplicate node"
          >
            <Copy className="w-3 h-3 text-blue-600" />
          </Button>
          {nodes.length > 1 && (
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 bg-white shadow-lg hover:bg-red-50 border-red-200"
              onClick={(e) => deleteNode(node.id, e)}
              title="Delete node"
            >
              <Trash2 className="w-3 h-3 text-red-600" />
            </Button>
          )}
        </div>

        {isConnecting && <div className="absolute inset-0 border-2 border-green-400 rounded-xl animate-pulse" />}
      </div>
    )
  }

  const ConnectionLine = ({ connection }: { connection: Connection }) => {
    const fromNode = nodes.find((n) => n.id === connection.from)
    const toNode = nodes.find((n) => n.id === connection.to)

    if (!fromNode || !toNode) return null

    const fromX = fromNode.position.x + 200
    const fromY = fromNode.position.y + 40
    const toX = toNode.position.x
    const toY = toNode.position.y + 40

    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    const isSelected = selectedConnection?.id === connection.id

    return (
      <g>
        {/* Connection path with enhanced styling */}
        <path
          d={`M ${fromX} ${fromY} C ${midX} ${fromY} ${midX} ${toY} ${toX} ${toY}`}
          stroke={isSelected ? "#3b82f6" : "#6b7280"}
          strokeWidth={isSelected ? "3" : "2"}
          fill="none"
          markerEnd="url(#arrowhead)"
          className="cursor-pointer hover:stroke-blue-500 transition-colors duration-200"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedConnection(connection)
            setSelectedNode(null)
          }}
        />

        {/* Connection label */}
        {connection.label && (
          <g>
            <rect
              x={midX - 25}
              y={midY - 10}
              width="50"
              height="20"
              rx="10"
              fill="white"
              stroke={isSelected ? "#3b82f6" : "#d1d5db"}
              strokeWidth="1"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedConnection(connection)
                setSelectedNode(null)
              }}
            />
            <text x={midX} y={midY + 4} textAnchor="middle" className="text-xs fill-gray-600 pointer-events-none">
              {connection.label}
            </text>
          </g>
        )}

        {/* Delete button for selected connection */}
        {isSelected && (
          <g>
            <circle
              cx={midX + 35}
              cy={midY - 15}
              r="8"
              fill="white"
              stroke="#ef4444"
              strokeWidth="1"
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                deleteConnection(connection.id)
              }}
            />
            <text x={midX + 35} y={midY - 11} textAnchor="middle" className="text-xs fill-red-500 pointer-events-none">
              ×
            </text>
          </g>
        )}
      </g>
    )
  }

  // Handle mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedNode && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        const newPosition = {
          x: (e.clientX - rect.left - dragOffset.x - panOffset.x) / zoom,
          y: (e.clientY - rect.top - dragOffset.y - panOffset.y) / zoom,
        }
        handleNodeDrag(draggedNode, newPosition)
      }
    }

    const handleMouseUp = () => {
      setDraggedNode(null)
      setConnecting(null)
    }

    if (draggedNode) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [draggedNode, dragOffset, handleNodeDrag, zoom, panOffset])

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + delta)))
  }

  const resetView = () => {
    setZoom(1)
    setPanOffset({ x: 0, y: 0 })
  }

  return (
    <div className="h-full flex bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50 shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Workflow className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Workflow Builder</h2>
              <p className="text-sm text-gray-600">Design approval workflows visually</p>
            </div>
          </div>
          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="mb-4 border-blue-200 focus:border-blue-400"
            placeholder="Enter workflow name"
          />
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
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
                        const Icon = nodeType.icon
                        return (
                          <Button
                            key={nodeType.type}
                            variant="outline"
                            className="w-full h-auto p-3 flex items-start gap-3 bg-transparent hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200 text-left"
                            onClick={() => addNode(nodeType.type)}
                          >
                            <div className={cn("p-2 rounded-lg text-white shadow-xs shrink-0", nodeType.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="font-medium text-sm text-gray-800 truncate">{nodeType.label}</div>
                              <div className="text-xs text-gray-500 mt-1 leading-relaxed break-words">
                                {nodeType.details}
                              </div>
                            </div>
                          </Button>
                        )
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
              <Card className="p-4 border-blue-100 bg-blue-50/30">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-200">
                  <div
                    className={cn(
                      "p-2 rounded-lg text-white shadow-xs shrink-0",
                      nodeTypes.find((nt) => nt.type === selectedNode.type)?.color,
                    )}
                  >
                    {(() => {
                      const Icon = nodeTypes.find((nt) => nt.type === selectedNode.type)?.icon || Settings
                      return <Icon className="w-4 h-4" />
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-800 truncate">{selectedNode.data.title}</h4>
                    <p className="text-xs text-gray-600 break-words">
                      {nodeTypes.find((nt) => nt.type === selectedNode.type)?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="node-title" className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="w-3 h-3" />
                      Title
                    </Label>
                    <Input
                      id="node-title"
                      value={selectedNode.data.title}
                      onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="node-description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="node-description"
                      value={selectedNode.data.description || ""}
                      onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
                      rows={3}
                      className="mt-1"
                      placeholder="Add a description for this node..."
                    />
                  </div>

                  {selectedNode.type === "approval" && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                          <User className="w-3 h-3" />
                          Approval Settings
                        </h5>
                        <div>
                          <Label htmlFor="approver" className="text-sm font-medium">
                            Approver
                          </Label>
                          <Select
                            value={selectedNode.data.approver || ""}
                            onValueChange={(value) => updateNodeData(selectedNode.id, { approver: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select approver" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager">Direct Manager</SelectItem>
                              <SelectItem value="finance">Finance Team</SelectItem>
                              <SelectItem value="ceo">CEO</SelectItem>
                              <SelectItem value="custom">Custom User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="approval-timeout" className="text-sm font-medium flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            Timeout (hours)
                          </Label>
                          <Input
                            id="approval-timeout"
                            type="number"
                            value={selectedNode.data.timeout || "24"}
                            onChange={(e) => updateNodeData(selectedNode.id, { timeout: e.target.value })}
                            className="mt-1"
                            min="1"
                            max="168"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "condition" && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                          <GitBranch className="w-3 h-3" />
                          Condition Settings
                        </h5>
                        <div>
                          <Label htmlFor="condition" className="text-sm font-medium">
                            Condition Type
                          </Label>
                          <Select
                            value={selectedNode.data.condition || ""}
                            onValueChange={(value) => updateNodeData(selectedNode.id, { condition: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="amount">Amount greater than</SelectItem>
                              <SelectItem value="category">Category equals</SelectItem>
                              <SelectItem value="department">Department equals</SelectItem>
                              <SelectItem value="custom">Custom condition</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedNode.type === "notification" && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          Notification Settings
                        </h5>
                        <div>
                          <Label htmlFor="notification-type" className="text-sm font-medium">
                            Type
                          </Label>
                          <Select
                            value={selectedNode.data.notificationType || "email"}
                            onValueChange={(value) => updateNodeData(selectedNode.id, { notificationType: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="slack">Slack</SelectItem>
                              <SelectItem value="teams">Microsoft Teams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="message" className="text-sm font-medium">
                            Message Template
                          </Label>
                          <Textarea
                            id="message"
                            value={selectedNode.data.message || ""}
                            onChange={(e) => updateNodeData(selectedNode.id, { message: e.target.value })}
                            rows={4}
                            className="mt-1"
                            placeholder="Enter notification message template..."
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ) : selectedConnection ? (
              <Card className="p-4 border-purple-100 bg-purple-50/30">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-purple-200">
                  <div className="p-2 rounded-lg bg-purple-500 text-white shadow-xs">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Connection Settings</h4>
                    <p className="text-xs text-gray-600">Configure connection behavior</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="connection-label" className="text-sm font-medium">
                      Connection Label
                    </Label>
                    <Input
                      id="connection-label"
                      value={selectedConnection.label || ""}
                      onChange={(e) => {
                        setConnections((prev) =>
                          prev.map((conn) =>
                            conn.id === selectedConnection.id ? { ...conn, label: e.target.value } : conn,
                          ),
                        )
                        setSelectedConnection((prev) => (prev ? { ...prev, label: e.target.value } : null))
                      }}
                      className="mt-1"
                      placeholder="e.g., Success, Approved, Rejected"
                    />
                  </div>
                  <div>
                    <Label htmlFor="connection-condition" className="text-sm font-medium">
                      Condition
                    </Label>
                    <Textarea
                      id="connection-condition"
                      value={selectedConnection.condition || ""}
                      onChange={(e) => {
                        setConnections((prev) =>
                          prev.map((conn) =>
                            conn.id === selectedConnection.id ? { ...conn, condition: e.target.value } : conn,
                          ),
                        )
                        setSelectedConnection((prev) => (prev ? { ...prev, condition: e.target.value } : null))
                      }}
                      rows={3}
                      className="mt-1"
                      placeholder="Define when this connection should be taken"
                    />
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-8 h-8 text-blue-500" />
                </div>
                <h4 className="font-medium text-gray-800 mb-1">No Selection</h4>
                <p className="text-sm text-gray-500">Select a node or connection to edit its properties</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* ... existing canvas code ... */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative"
          style={{
            backgroundImage: `
              radial-gradient(circle, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${panOffset.x}px ${panOffset.y}px`,
            transform: `scale(${zoom})`,
            transformOrigin: "0 0",
          }}
          onClick={() => {
            setSelectedNode(null)
            setSelectedConnection(null)
          }}
        >
          {/* Enhanced SVG for connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
              </marker>
            </defs>

            {/* Render connections */}
            {connections.map((connection) => (
              <ConnectionLine key={connection.id} connection={connection} />
            ))}

            {/* Connection preview while connecting */}
            {connecting && (
              <path
                d={`M ${connecting.position.x} ${connecting.position.y} L ${mousePosition.x} ${mousePosition.y}`}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
                className="animate-pulse"
              />
            )}
          </svg>

          {/* Render nodes */}
          {nodes.map((node) => (
            <NodeComponent key={node.id} node={node} />
          ))}
        </div>

        {/* Enhanced Toolbar */}
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
            <Button size="sm" variant="ghost" onClick={() => handleZoom(0.1)} className="w-8 h-8 p-0" title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleZoom(-0.1)} className="w-8 h-8 p-0" title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={resetView} className="w-8 h-8 p-0" title="Reset view">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" className="bg-white shadow-lg">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 shadow-lg">
            <Play className="w-4 h-4 mr-2" />
            Test Workflow
          </Button>
        </div>

        {/* Enhanced Status bar */}
        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-sm">
          <Card className="px-3 py-2 bg-white/90 backdrop-blur-xs border-gray-200">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                {nodes.length} nodes
              </Badge>
              <Badge variant="outline" className="bg-white">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                {connections.length} connections
              </Badge>
              <Badge variant="outline" className="bg-white">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                {Math.round(zoom * 100)}% zoom
              </Badge>
              {selectedNode && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {selectedNode.data.title} selected
                </Badge>
              )}
              {selectedConnection && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Connection selected
                </Badge>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
