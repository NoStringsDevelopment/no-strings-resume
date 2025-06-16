
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  Zap, 
  Bot, 
  Briefcase, 
  Users, 
  Mail, 
  Calendar, 
  Link,
  ArrowLeft,
  Clock,
  Upload,
  ExternalLink,
  Shield,
  AlertTriangle
} from "lucide-react";

const Integrations = () => {
  const navigate = useNavigate();

  const integrations = [
    {
      icon: Upload,
      title: "JSON Resume Registry",
      description: "Publish your resume to the public JSON Resume registry. Note: This uploads your data to external servers and makes it publicly accessible.",
      category: "Publishing",
      status: "planned",
      privacy: "external"
    },
    {
      icon: ExternalLink,
      title: "Reactive Resume Builder",
      description: "Export your resume data to Reactive Resume Builder for additional editing features. Note: This involves sharing your data with a third-party service.",
      category: "Export",
      status: "planned",
      privacy: "external"
    },
    {
      icon: Zap,
      title: "Zapier",
      description: "Automate resume workflows with 5,000+ apps. Trigger actions when resumes are updated or exported.",
      category: "Automation",
      status: "planned",
      privacy: "external"
    },
    {
      icon: Bot,
      title: "AI Resume Optimization",
      description: "Get AI-powered suggestions to optimize your resume for specific job descriptions and ATS systems.",
      category: "AI",
      status: "planned",
      privacy: "external"
    },
    {
      icon: Briefcase,
      title: "Job Board Sync",
      description: "Automatically sync your resume to LinkedIn, Indeed, and other major job platforms.",
      category: "Job Search",
      status: "planned",
      privacy: "external"
    },
    {
      icon: Users,
      title: "HR Management Systems",
      description: "Direct integration with popular ATS and HR platforms like Workday, BambooHR, and Greenhouse.",
      category: "HR Tools",
      status: "planned",
      privacy: "external"
    },
    {
      icon: Mail,
      title: "Email Templates",
      description: "Generate personalized cover letters and follow-up emails based on your resume data.",
      category: "Communication",
      status: "planned",
      privacy: "local"
    },
    {
      icon: Calendar,
      title: "Interview Scheduling",
      description: "Connect with Calendly, Google Calendar, and other scheduling tools for seamless interview booking.",
      category: "Scheduling",
      status: "planned",
      privacy: "external"
    },
    {
      icon: Link,
      title: "Portfolio Integration",
      description: "Link to GitHub, Behance, Dribbble, and other portfolio platforms to showcase your work.",
      category: "Portfolio",
      status: "planned",
      privacy: "external"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "beta":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Beta</Badge>;
      case "planned":
        return <Badge variant="outline" className="border-gray-300 text-gray-600">
          <Clock className="w-3 h-3 mr-1" />
          Planned
        </Badge>;
      default:
        return null;
    }
  };

  const getPrivacyBadge = (privacy: string) => {
    switch (privacy) {
      case "external":
        return (
          <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Shares Data
          </Badge>
        );
      case "local":
        return (
          <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
            <Shield className="w-3 h-3 mr-1" />
            Privacy-Safe
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              data-testid="home-button"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">No Strings Resume</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
              data-testid="back-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Optional Integrations
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            For users who choose to share their data externally, these integrations 
            can extend No Strings Resume's functionality.
          </p>
          
          {/* Privacy Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 text-left max-w-3xl mx-auto">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 mb-2">Privacy Notice</h3>
                <p className="text-amber-800 leading-relaxed mb-3">
                  <strong>No Strings Resume's core principle is privacy-first operation.</strong> By default, 
                  all your resume data stays in your browser and is never sent to external servers.
                </p>
                <p className="text-amber-800 leading-relaxed">
                  The integrations below are <strong>optional features</strong> that would require you to 
                  explicitly choose to upload your data to third-party services. Each integration will 
                  clearly explain what data is shared and with whom before you proceed.
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4 mr-2" />
            Coming Soon - Based on Community Demand
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
              data-testid={`integration-card-${integration.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <integration.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(integration.status)}
                    {getPrivacyBadge(integration.privacy)}
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900">{integration.title}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {integration.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {integration.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Request an Integration
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Don't see the integration you need? Let us know what tools you'd like to connect 
              with No Strings Resume and we'll prioritize based on community demand.
            </p>
            
            {/* Privacy Reminder */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
              <div className="flex items-start space-x-2">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <strong>Remember:</strong> All integrations are optional. No Strings Resume will always work 
                  completely offline with your data staying in your browser. Integrations are for users who 
                  specifically choose to share their data externally.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://github.com/NoStringsDevelopment/no-strings-resume/discussions', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
                data-testid="request-integration-button"
              >
                Request Integration
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/contribute')}
                data-testid="contribute-button"
              >
                Contribute to Development
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">No Strings Resume</span>
          </div>
          <p className="text-gray-600 mb-4">Open source resume builder. Your data, your control.</p>
          <div className="text-sm text-gray-500">
            Built with React, Tailwind CSS, and respect for your privacy.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Integrations;
