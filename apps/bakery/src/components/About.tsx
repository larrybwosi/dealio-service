import { Users, Clock, Heart, Award } from "lucide-react";

const About = () => {
  const stats = [
    {
      icon: Clock,
      number: "25+",
      label: "Years of Experience",
    },
    {
      icon: Users,
      number: "10,000+",
      label: "Happy Customers",
    },
    {
      icon: Heart,
      number: "50+",
      label: "Recipes Perfected",
    },
    {
      icon: Award,
      number: "12",
      label: "Awards Won",
    },
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-6">
                Crafting Memories
                <span className="block text-primary">Since 1999</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                At The Cake panier, we believe that great baking starts with passion,
                quality ingredients, and time-honored traditions. Our master bakers arrive 
                before dawn to ensure every loaf, croissant, and pastry meets our exacting standards.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From our signature sourdough made with a century-old starter to our 
                delicate French pastries, every item in our bakery tells a story of 
                craftsmanship and dedication to the art of baking.
              </p>
            </div>

            {/* Values */}
            <div className="space-y-4">
              <h3 className="text-xl font-display font-semibold text-foreground mb-4">
                Our Commitment
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Fresh ingredients sourced locally</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Traditional baking methods preserved</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">No artificial preservatives or additives</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-foreground">Sustainable packaging and practices</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bakery-card text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-display font-bold text-foreground mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Section */}
        <div className="mt-20 text-center">
          <div className="max-w-3xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-display font-medium text-foreground italic mb-6">
              "Baking is not just our profession, it's our passion. Every morning, 
              we have the privilege of creating something that brings joy to families 
              and friends around our community."
            </blockquote>
            <cite className="text-primary font-medium">
              - Marie & Jean-Pierre Dubois, Master Bakers & Founders
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;