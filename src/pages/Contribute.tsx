import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Github, MessageSquare, Heart, Code, Bug, FileText, Check, ExternalLink } from "lucide-react";

const Contribute = () => {
  const navigate = useNavigate();
  
  const contributionWays = [
    {
      icon: Code,
      title: "Code Contributions",
      description: <>
        Help improve the codebase by submitting pull requests for new features, bug fixes, or improvements. 
        You can also help build{' '}
        <button onClick={() => navigate('/integrations')} className="text-blue-600 hover:text-blue-800 underline font-medium">
          new integrations
        </button>
        {' '}for popular services.
      </>,
      action: "View Repository",
      link: "https://github.com/NoStringsDevelopment/no-strings-resume"
    },
    {
      icon: Bug,
      title: "Report Issues",
      description: "Found a bug or have a feature request? Let us know by creating an issue on GitHub.",
      action: "Report Issue",
      link: "https://github.com/NoStringsDevelopment/no-strings-resume/issues"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Help improve documentation, write tutorials, or contribute to the project's knowledge base.",
      action: "Contribute Docs",
      link: "https://github.com/NoStringsDevelopment/no-strings-resume"
    },
    {
      icon: MessageSquare,
      title: "Community Support",
      description: "Help other users by answering questions and providing support in discussions.",
      action: "Join Discussions",
      link: "https://github.com/NoStringsDevelopment/no-strings-resume/discussions"
    }
  ];
  
  const supportFeatures = [
    "Support ongoing development and maintenance",
    "Help cover hosting and infrastructure costs", 
    "Enable new features and improvements"
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700" data-testid="back-to-home-btn">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">No Strings Resume</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Help Make{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600" data-testid="gradient-text">
              No Strings Resume
            </span>
            <br />Even Better
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            No Strings Resume is an open-source project built by the community, for the community. 
            Your contributions help make privacy-first resume building accessible to everyone.
          </p>
        </div>
      </section>

      {/* Support Section - Improved design */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Header */}
            <div className="mb-12">
              <Heart className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Support the Project</h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                If you find No Strings Resume helpful and want to support its development, 
                consider making a donation. Every contribution helps keep the project running and growing.
              </p>
            </div>
            
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {supportFeatures.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-gray-700 font-medium">{feature}</p>
                </div>
              ))}
            </div>
            
            {/* Donation Card */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Make a Donation</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Support the development of No Strings Resume with a secure payment via Stripe.
              </p>
              
              {/* QR Code */}
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <img 
                    src="/placeholder.svg" 
                    alt="QR Code for donation (placeholder)" 
                    className="w-48 h-48 rounded-lg"
                  />
                </div>
              </div>
              
              <p className="text-gray-500 mb-6">Scan with your phone to donate</p>
              
              {/* Stripe Button */}
              <div className="space-y-4">
                <Button 
                  onClick={() => window.open('https://buy.stripe.com/6oU5kF8MzcKqgU18EPfUQ07', '_blank')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  <ExternalLink className="w-5 h-5 mr-3" />
                  Donate via Stripe
                </Button>
                <p className="text-sm text-gray-500">
                  Secure payment processing • No account required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution Ways */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ways to Contribute</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're a developer, designer, writer, or just someone who loves the project, 
            there are many ways to get involved.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contributionWays.map((way, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white" data-testid={`contribution-card-${way.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <way.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{way.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed mb-4">
                  {way.description}
                </CardDescription>
                <Button variant="outline" onClick={() => window.open(way.link, '_blank')} className="w-full" data-testid={`contribution-button-${way.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Github className="w-4 h-4 mr-2" />
                  {way.action}
                </Button>
              </CardContent>
            </Card>
          ))}
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

export default Contribute;
