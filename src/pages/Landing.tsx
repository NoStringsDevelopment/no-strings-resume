
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Download, Eye, Edit, Palette, FileText, Heart } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  
  const features = [{
    icon: Shield,
    title: "Privacy First",
    description: "Your data never leaves your browser. No accounts, no tracking, no hidden data collection."
  }, {
    icon: Edit,
    title: "Easy Editing",
    description: "Intuitive form-based editing with live preview. Add, remove, and reorder sections with ease."
  }, {
    icon: Palette,
    title: "Theme Customization",
    description: "Choose from professional themes or customize colors and fonts to match your style."
  }, {
    icon: Download,
    title: "Multiple Formats",
    description: "Export to PDF, DOCX, HTML, or JSON. ATS-friendly formatting for better job application success."
  }, {
    icon: Eye,
    title: "Live Preview",
    description: "See your changes instantly with real-time preview. What you see is what you get."
  }, {
    icon: FileText,
    title: "Industry Standard",
    description: "Built on JSON Resume standard v1.2.1 for compatibility and future-proofing."
  }];
  
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">No Strings Resume</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="outline" onClick={() => navigate('/contribute')} data-testid="contribute-btn">
                <Heart className="w-4 h-4 mr-2" />
                Contribute
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Resume Builder with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> No Strings Attached</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Create professional resumes entirely in your browser. Your data stays private – no accounts, 
            no cloud storage, no hidden tracking. Export to PDF, DOCX, and more formats.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/edit')} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg" data-testid="start-building-btn">
              Start Building Resume
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/view')} className="px-8 py-3 text-lg" data-testid="view-sample-resume-btn">
              View Sample Resume
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose No Strings Resume?</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Built for who wants convenient and full control over their data and resume formatting.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>)}
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Simple steps to create your professional resume</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Fill Your Information</h4>
              <p className="text-gray-600">Enter your details using our intuitive form. Add work experience, education, skills, and more.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Customize Design</h4>
              <p className="text-gray-600">Choose from professional themes and customize colors to match your personal brand.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Export & Share</h4>
              <p className="text-gray-600">Download your resume in PDF, DOCX, or other formats. Or easily deploy it yourself and share the link for online viewing.</p>
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
    </div>;
};

export default Landing;
