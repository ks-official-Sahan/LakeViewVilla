"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import {
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  Code2,
  Database,
  Smartphone,
  Cloud,
  Palette,
  Zap,
  ExternalLink,
  Star,
  Coffee,
  Heart,
  MapPin,
  Calendar,
  Award,
  Briefcase,
  Rocket,
  Users,
  Shield,
  Download,
  TrendingUp,
  Globe,
  Terminal,
  Server,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ErrorBoundary } from "@/components/error-boundary";
import { MagicCard } from "@/components/ui/magic-card";
import { Spotlight } from "@/components/ui/spotlight";
import { cn } from "@/lib/utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

const techStack = [
  {
    name: "React",
    icon: Code2,
    color: "text-blue-500",
    category: "Frontend",
    level: 95,
  },
  {
    name: "Next.js",
    icon: Code2,
    color: "text-black dark:text-white",
    category: "Framework",
    level: 92,
  },
  {
    name: "TypeScript",
    icon: Terminal,
    color: "text-blue-600",
    category: "Language",
    level: 90,
  },
  {
    name: "TailwindCSS",
    icon: Palette,
    color: "text-cyan-500",
    category: "Styling",
    level: 94,
  },
  {
    name: "Node.js",
    icon: Server,
    color: "text-green-500",
    category: "Backend",
    level: 88,
  },
  {
    name: "Supabase",
    icon: Database,
    color: "text-emerald-500",
    category: "Database",
    level: 85,
  },
  {
    name: "React Native",
    icon: Smartphone,
    color: "text-purple-500",
    category: "Mobile",
    level: 80,
  },
  {
    name: "Docker",
    icon: Cloud,
    color: "text-blue-400",
    category: "DevOps",
    level: 75,
  },
  {
    name: "AWS",
    icon: Cloud,
    color: "text-orange-500",
    category: "Cloud",
    level: 78,
  },
  {
    name: "Framer Motion",
    icon: Zap,
    color: "text-pink-500",
    category: "Animation",
    level: 92,
  },
  {
    name: "GSAP",
    icon: Zap,
    color: "text-green-400",
    category: "Animation",
    level: 88,
  },
  {
    name: "GitHub Actions",
    icon: Workflow,
    color: "text-gray-600",
    category: "CI/CD",
    level: 82,
  },
];

const contributions = [
  {
    title: "Content Management System",
    description:
      "Built a comprehensive CMS for managing travel content, videos, and destinations with real-time updates.",
    icon: Database,
    color: "text-blue-500",
    features: [
      "Real-time sync",
      "Media management",
      "SEO optimization",
      "Content versioning",
    ],
    tech: ["Supabase", "Next.js", "TypeScript"],
  },
  {
    title: "Admin & Developer Portals",
    description:
      "Developed role-based admin interfaces with advanced analytics, user management, and system monitoring.",
    icon: Shield,
    color: "text-purple-500",
    features: [
      "Role-based access",
      "Analytics dashboard",
      "User management",
      "System logs",
    ],
    tech: ["React", "Zustand", "Chart.js"],
  },
  {
    title: "Real-time Integration",
    description:
      "Implemented WebSocket connections for live updates, notifications, and collaborative features.",
    icon: Zap,
    color: "text-yellow-500",
    features: [
      "Live notifications",
      "Real-time sync",
      "WebSocket API",
      "Event streaming",
    ],
    tech: ["WebSocket", "Supabase Realtime", "Node.js"],
  },
  {
    title: "Performance Optimization",
    description:
      "Achieved 98% Lighthouse scores through image optimization, lazy loading, and code splitting.",
    icon: Rocket,
    color: "text-red-500",
    features: [
      "Image optimization",
      "Code splitting",
      "Lazy loading",
      "Caching strategies",
    ],
    tech: ["Next.js", "Vercel", "CDN"],
  },
];

const achievements = [
  {
    icon: Award,
    text: "5+ Years Experience",
    metric: "2019-2024",
    color: "text-yellow-500",
  },
  {
    icon: Star,
    text: "Open Source Contributor",
    metric: "50+ Repos",
    color: "text-blue-500",
  },
  {
    icon: Briefcase,
    text: "Projects Completed",
    metric: "20+",
    color: "text-green-500",
  },
  {
    icon: Users,
    text: "Team Leadership",
    metric: "10+ Devs",
    color: "text-purple-500",
  },
  {
    icon: TrendingUp,
    text: "Performance Score",
    metric: "98%",
    color: "text-red-500",
  },
  {
    icon: Coffee,
    text: "Coffee Consumed",
    metric: "∞ Cups",
    color: "text-amber-500",
  },
];

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: "https://github.com/ks-official-sahan",
    color: "hover:text-gray-600",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/in/sahan-sachintha",
    color: "hover:text-blue-600",
  },
  {
    name: "Email",
    icon: Mail,
    href: "mailto:ks.official.sahan@gmail.com",
    color: "hover:text-red-500",
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    href: "https://wa.me/94768701148?text=Hello%2C%20I%20saw%20your%20website%20and%20I%27m%20interested.",
    color: "hover:text-green-500",
  },
];

const TechCard = ({ tech, index }: { tech: any; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setIsVisible(true), index * 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
    >
      <MagicCard className="p-4 h-full text-center hover:shadow-2xl transition-all duration-500 border-white/10 hover:border-white/20">
        <div className="space-y-3">
          <motion.div
            className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 mx-auto w-fit"
            whileHover={{ rotate: 5 }}
          >
            <tech.icon className={cn("h-6 w-6", tech.color)} />
          </motion.div>
          <div className="space-y-1">
            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
              {tech.name}
            </h3>
            <Badge variant="outline" className="text-xs">
              {tech.category}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Skill</span>
              <span className="font-medium">{tech.level}%</span>
            </div>
            <Progress
              value={isVisible ? tech.level : 0}
              className="h-1.5 bg-muted/30"
            />
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
};

const ContributionCard = ({
  contribution,
  index,
}: {
  contribution: any;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      className="group"
    >
      <MagicCard className="p-6 h-full hover:shadow-2xl transition-all duration-500 border-white/10 hover:border-white/20">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <motion.div
              className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 flex-shrink-0"
              whileHover={{ rotate: 5 }}
            >
              <contribution.icon
                className={cn("h-6 w-6", contribution.color)}
              />
            </motion.div>
            <div className="space-y-2 flex-1">
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                {contribution.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {contribution.description}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Features:</h4>
              <div className="flex flex-wrap gap-1">
                {contribution.features.map((feature: string) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Technologies:</h4>
              <div className="flex flex-wrap gap-1">
                {contribution.tech.map((tech: string) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
};

const AchievementCard = ({
  achievement,
  index,
}: {
  achievement: any;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="group"
    >
      <MagicCard className="p-6 text-center h-full hover:shadow-2xl transition-all duration-500 border-white/10 hover:border-white/20">
        <div className="space-y-4">
          <motion.div
            className="relative mx-auto w-fit"
            whileHover={{ rotate: 5 }}
          >
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
              <achievement.icon
                className={cn("h-8 w-8 mx-auto", achievement.color)}
              />
            </div>
          </motion.div>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-primary group-hover:text-accent transition-colors">
              {achievement.metric}
            </p>
            <p className="text-sm font-medium text-muted-foreground leading-tight">
              {achievement.text}
            </p>
          </div>
        </div>
      </MagicCard>
    </motion.div>
  );
};

export default function DeveloperInfoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Split text animation for hero title
      if (titleRef.current) {
        const text = titleRef.current.textContent;
        if (text) {
          titleRef.current.innerHTML = text
            .split("")
            .map(
              (char, i) =>
                `<span class="char" style="display: inline-block;">${
                  char === " " ? "&nbsp;" : char
                }</span>`
            )
            .join("");

          gsap.fromTo(
            ".char",
            {
              opacity: 0,
              y: 50,
              rotationX: -90,
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              stagger: 0.05,
            }
          );
        }
      }

      // Hero content animations
      gsap.fromTo(
        ".hero-subtitle",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: 1,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".hero-buttons",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1.5,
          ease: "power2.out",
        }
      );

      // Section reveals
      gsap.utils.toArray(".reveal-section").forEach((element: any) => {
        gsap.fromTo(
          element,
          {
            opacity: 0,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Floating animations
      gsap.utils.toArray(".float-element").forEach((element: any, index) => {
        gsap.to(element, {
          y: -15,
          duration: 2 + index * 0.2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
          delay: index * 0.3,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <ErrorBoundary>
      <div ref={containerRef} className="min-h-screen relative">
        {/* Enhanced Background */}
        <motion.div className="fixed inset-0 z-0" style={{ y: backgroundY }}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/10 to-primary/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,197,94,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_60%)]" />
          <Spotlight
            className="top-40 left-0 md:left-60 md:-top-20"
            fill="rgba(34, 197, 94, 0.4)"
          />
        </motion.div>

        <main className="relative z-10 pt-20">
          {/* Hero Section */}
          <section ref={heroRef} className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-6 space-y-8">
              <div className="text-center space-y-6">
                <div
                  ref={titleRef}
                  className="text-5xl md:text-7xl font-bold text-gradient"
                >
                  Meet the Developer
                </div>

                <div className="hero-subtitle space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold">
                    Sahan Sachintha
                  </h2>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                    Full-Stack Software Engineer specializing in immersive web
                    experiences and scalable applications
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Badge variant="secondary" className="px-4 py-2">
                      <MapPin className="mr-2 h-4 w-4" />
                      Sri Lanka
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      5+ Years Experience
                    </Badge>
                    <Badge variant="secondary" className="px-4 py-2">
                      <Globe className="mr-2 h-4 w-4" />
                      Available Worldwide
                    </Badge>
                  </div>
                </div>

                <div className="hero-buttons flex flex-wrap justify-center gap-4">
                  <Button
                    size="lg"
                    className="group shadow-xl hover:shadow-primary/25 px-8"
                    asChild
                  >
                    <Link
                      href="https://github.com/ks-official-sahan"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      View GitHub
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="group px-8"
                    asChild
                  >
                    <Link href="mailto:ks.official.sahan@gmail.com">
                      <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Contact Me
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Developer Identity Card */}
          <section className="reveal-section py-16">
            <div className="max-w-4xl mx-auto px-6">
              <MagicCard className="p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <motion.div
                    className="flex-shrink-0 float-element"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Avatar className="h-32 w-32 ring-4 ring-primary/30 shadow-2xl">
                      <AvatarImage
                        src="https://avatars.githubusercontent.com/u/109258288?v=4"
                        alt="Sahan Sachintha - Full-Stack Developer"
                      />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-accent text-white font-bold">
                        SS
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-primary">
                        Sahan Sachintha
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        Full-Stack Software Engineer
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">
                      Passionate about creating exceptional digital experiences
                      with modern technologies. Specializing in React, Next.js,
                      and full-stack development with a focus on performance,
                      scalability, and user experience. Currently building the
                      Green Roamer platform with cutting-edge web technologies.
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      {socialLinks.map((link) => (
                        <Button
                          key={link.name}
                          variant="outline"
                          size="sm"
                          className={cn("group", link.color)}
                          asChild
                        >
                          <Link
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <link.icon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            {link.name}
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </MagicCard>
            </div>
          </section>

          {/* Technology Stack Grid */}
          <section className="reveal-section py-16 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                  Technology Stack
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Technologies and frameworks I use to build exceptional digital
                  experiences
                </p>
              </motion.div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {techStack.map((tech, index) => (
                  <TechCard key={tech.name} tech={tech} index={index} />
                ))}
              </div>
            </div>
          </section>

          {/* Contributions to Green Roamer */}
          <section className="reveal-section py-16">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                  Green Roamer Contributions
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Key systems and features I've built for the Green Roamer
                  platform
                </p>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                {contributions.map((contribution, index) => (
                  <ContributionCard
                    key={contribution.title}
                    contribution={contribution}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Achievements */}
          <section className="reveal-section py-16 bg-gradient-to-b from-transparent via-muted/20 to-transparent">
            <div className="max-w-6xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
                  Achievements & Milestones
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Key accomplishments and metrics that define my development
                  journey
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {achievements.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.text}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Call-to-Action Footer */}
          <section className="reveal-section py-16">
            <div className="max-w-4xl mx-auto px-6">
              <MagicCard className="p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-gradient">
                      Want to Collaborate?
                    </h2>
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      Ready to bring your ideas to life? I'm available for
                      freelance projects, collaborations, and full-time
                      opportunities. Let's create something amazing together.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4">
                    <Button size="lg" className="group shadow-lg" asChild>
                      <Link
                        href="https://github.com/ks-official-sahan"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        View GitHub
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group"
                      asChild
                    >
                      <Link href="mailto:ks.official.sahan@gmail.com">
                        <Mail className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Contact Me
                      </Link>
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      className="group"
                      asChild
                    >
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          window.print();
                        }}
                      >
                        <Download className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Download CV
                      </Link>
                    </Button>
                  </div>

                  <Separator />

                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div className="space-y-2">
                      <Coffee className="h-6 w-6 mx-auto text-amber-500" />
                      <p className="text-sm font-medium">
                        Available for Freelance
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Full-time & Part-time projects
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Heart className="h-6 w-6 mx-auto text-red-500" />
                      <p className="text-sm font-medium">
                        Open to Collaborations
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Team projects & partnerships
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Globe className="h-6 w-6 mx-auto text-blue-500" />
                      <p className="text-sm font-medium">Remote Worldwide</p>
                      <p className="text-xs text-muted-foreground">
                        Flexible timezone coverage
                      </p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Response time: Usually within 24 hours • Available
                      Mon-Fri, 9AM-6PM (GMT+5:30)
                    </p>
                  </div>
                </div>
              </MagicCard>
            </div>
          </section>
        </main>

        {/* Ambient Elements */}
        <div className="fixed inset-0 pointer-events-none z-5">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-accent/5 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
