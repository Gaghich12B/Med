import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { SignOutButton } from "@/components/sign-out-button"
import { 
  BookOpen, 
  Search, 
  FileText,
  ExternalLink,
  TrendingUp,
  Globe,
  FlaskConical,
  Building2,
  Stethoscope
} from "lucide-react"

import type { LucideIcon } from "lucide-react"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Building2,
  FlaskConical,
  Stethoscope,
  Globe,
}

// Accredited external medical resources — always available regardless of database state
const ACCREDITED_RESOURCES = [
  {
    category: "Government & Official Health Agencies",
    icon: "Building2",
    color: "blue",
    resources: [
      { name: "Centers for Disease Control and Prevention (CDC)", url: "https://www.cdc.gov", description: "U.S. national public health agency — disease surveillance, prevention guidelines, and clinical resources" },
      { name: "National Institutes of Health (NIH)", url: "https://www.nih.gov", description: "World's largest biomedical research agency — clinical trials, research news, and health information" },
      { name: "World Health Organization (WHO)", url: "https://www.who.int", description: "Global health authority — international clinical guidelines, disease outbreaks, and health statistics" },
      { name: "U.S. Food & Drug Administration (FDA)", url: "https://www.fda.gov", description: "Drug approvals, safety alerts, prescribing information, and clinical guidance" },
      { name: "Agency for Healthcare Research and Quality (AHRQ)", url: "https://www.ahrq.gov", description: "Evidence-based practice, patient safety tools, and clinical quality improvement resources" },
      { name: "MedlinePlus (NLM)", url: "https://medlineplus.gov", description: "Authoritative patient and clinician health information from the National Library of Medicine" },
      { name: "National Library of Medicine (NLM)", url: "https://www.nlm.nih.gov", description: "World's largest biomedical library — databases, journals, and clinical tools" },
    ]
  },
  {
    category: "Peer-Reviewed Medical Journals",
    icon: "FlaskConical",
    color: "green",
    resources: [
      { name: "PubMed / MEDLINE", url: "https://pubmed.ncbi.nlm.nih.gov", description: "Free database of 35+ million peer-reviewed biomedical articles from the NLM" },
      { name: "New England Journal of Medicine (NEJM)", url: "https://www.nejm.org", description: "Prestigious peer-reviewed general medicine journal publishing landmark clinical research" },
      { name: "JAMA Network", url: "https://jamanetwork.com", description: "Journal of the American Medical Association and JAMA specialty journals" },
      { name: "The Lancet", url: "https://www.thelancet.com", description: "International general medical journal — original research, reviews, and clinical correspondence" },
      { name: "BMJ (British Medical Journal)", url: "https://www.bmj.com", description: "Global medical journal covering clinical research, guidelines, and health policy" },
      { name: "Annals of Internal Medicine", url: "https://www.acponline.org/journals-publications/annals-of-internal-medicine", description: "American College of Physicians flagship journal for internal medicine research" },
      { name: "Cochrane Library", url: "https://www.cochranelibrary.com", description: "Gold-standard systematic reviews and meta-analyses for evidence-based medicine" },
      { name: "Nature Medicine", url: "https://www.nature.com/nm", description: "High-impact translational and clinical research from Nature Publishing Group" },
    ]
  },
  {
    category: "Clinical Decision Support & Guidelines",
    icon: "Stethoscope",
    color: "purple",
    resources: [
      { name: "UpToDate", url: "https://www.uptodate.com", description: "Evidence-based clinical decision support used in 190+ countries — synthesized recommendations at point-of-care" },
      { name: "Medscape Reference", url: "https://reference.medscape.com", description: "Free drug reference, disease monographs, clinical calculators, and CME content" },
      { name: "DynaMed (EBSCO)", url: "https://www.dynamed.com", description: "Evidence-based clinical reference covering 3,000+ clinical topics with graded recommendations" },
      { name: "NICE Guidelines (UK)", url: "https://www.nice.org.uk/guidance", description: "National Institute for Health and Care Excellence — evidence-based UK clinical guidelines" },
      { name: "Epocrates", url: "https://www.epocrates.com", description: "Mobile clinical decision support — drug information, interactions, and clinical guidelines" },
      { name: "Clinical Pharmacology (Elsevier)", url: "https://www.clinicalpharmacology-ip.com", description: "Comprehensive drug monographs, interaction checker, and IV compatibility tool" },
    ]
  },
  {
    category: "Medical Specialty Organizations",
    icon: "Globe",
    color: "orange",
    resources: [
      { name: "American Heart Association (AHA)", url: "https://www.heart.org", description: "Cardiovascular disease guidelines, CPR/ACLS standards, and research publications" },
      { name: "American College of Cardiology (ACC)", url: "https://www.acc.org", description: "Cardiology clinical guidelines, quality metrics, and professional education" },
      { name: "American Diabetes Association (ADA)", url: "https://www.diabetes.org", description: "Standards of medical care in diabetes — annual evidence-based guidelines" },
      { name: "American College of Physicians (ACP)", url: "https://www.acponline.org", description: "Internal medicine clinical guidelines, Annals of Internal Medicine, and practice resources" },
      { name: "American Academy of Pediatrics (AAP)", url: "https://www.aap.org", description: "Pediatric clinical guidelines, policy statements, and Red Book on infectious diseases" },
      { name: "American College of Obstetricians and Gynecologists (ACOG)", url: "https://www.acog.org", description: "OB/GYN practice bulletins, committee opinions, and clinical management guidelines" },
      { name: "American College of Emergency Physicians (ACEP)", url: "https://www.acep.org", description: "Emergency medicine clinical policies, practice guidelines, and educational resources" },
      { name: "Infectious Diseases Society of America (IDSA)", url: "https://www.idsociety.org", description: "Infectious disease treatment guidelines — HIV, COVID-19, antimicrobial stewardship, and more" },
      { name: "Society of Critical Care Medicine (SCCM)", url: "https://www.sccm.org", description: "Critical care guidelines including Surviving Sepsis Campaign and ICU management protocols" },
      { name: "American Academy of Family Physicians (AAFP)", url: "https://www.aafp.org", description: "Family medicine clinical practice guidelines and continuing medical education" },
      { name: "American Thoracic Society (ATS)", url: "https://www.thoracic.org", description: "Pulmonary, critical care, and sleep medicine guidelines and clinical resources" },
      { name: "National Comprehensive Cancer Network (NCCN)", url: "https://www.nccn.org", description: "Oncology clinical practice guidelines and cancer treatment recommendations" },
      { name: "American Association of Critical-Care Nurses (AACN)", url: "https://www.aacn.org", description: "Critical care nursing standards, practice alerts, and evidence-based protocols" },
      { name: "Surviving Sepsis Campaign", url: "https://www.survivingsepsis.org", description: "International sepsis management guidelines — hour-1 bundle and ICU protocols" },
      { name: "Global Initiative for Chronic Obstructive Lung Disease (GOLD)", url: "https://goldcopd.org", description: "Annual evidence-based COPD diagnosis and management guidelines" },
      { name: "Global Initiative for Asthma (GINA)", url: "https://ginasthma.org", description: "International asthma management and prevention guidelines updated annually" },
    ]
  },
  {
    category: "Drug Information & Safety",
    icon: "FlaskConical",
    color: "red",
    resources: [
      { name: "FDA Drug Database", url: "https://www.accessdata.fda.gov/scripts/cder/daf/", description: "FDA-approved drug information, package inserts, and safety communications" },
      { name: "NIH DailyMed", url: "https://dailymed.nlm.nih.gov", description: "Current FDA-approved drug labeling and prescribing information from the NLM" },
      { name: "WHO Model Formulary", url: "https://www.who.int/publications/i/item/who-model-formulary-2008", description: "WHO essential medicines formulary with dosing, contraindications, and evidence" },
      { name: "Institute for Safe Medication Practices (ISMP)", url: "https://www.ismp.org", description: "Medication safety alerts, high-alert drug guidelines, and error-prevention resources" },
      { name: "Drugs.com (Professional)", url: "https://www.drugs.com/professionals.html", description: "Peer-reviewed drug monographs, interaction checker, and pill identifier for clinicians" },
    ]
  },
]

export default async function ReferencesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Get all published articles
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // Get unique categories
  const categories = [...new Set(articles.map(a => a.category))]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Healthcare Pro Network</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <SignOutButton />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Reference Library
          </h1>
          <p className="text-gray-600">
            Evidence-based medical articles and references
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search articles by title, category, or tags..."
                className="pl-10 h-12 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Category Filters */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            All Categories
          </Button>
          {categories.map(category => (
            <Button key={category} variant="ghost" size="sm">
              {category}
            </Button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.reduce((sum, a) => sum + a.views, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={`/references/${article.slug}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{article.category}</Badge>
                    <Badge 
                      variant={article.evidenceGrade === 'A' ? 'default' : 'outline'}
                      className={
                        article.evidenceGrade === 'A' ? 'bg-green-600' :
                        article.evidenceGrade === 'B' ? 'bg-blue-600' :
                        article.evidenceGrade === 'C' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }
                    >
                      Grade {article.evidenceGrade}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {article.title}
                  </CardTitle>
                  {article.summary && (
                    <CardDescription className="line-clamp-3">
                      {article.summary}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {article.author && (
                      <div className="text-sm text-gray-600">
                        By {article.author}
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {article.views} views
                      </span>
                      <span className="text-gray-600">
                        {article.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                    {article.tags && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.split(',').slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles available</h3>
              <p className="text-gray-600">
                Check back soon for new medical reference articles.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Accredited External Medical Resources */}
        <div className="mt-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Accredited Medical Resources
            </h2>
            <p className="text-gray-600">
              Verified and authoritative external resources for evidence-based clinical practice
            </p>
          </div>

          <div className="space-y-8">
            {ACCREDITED_RESOURCES.map((group) => {
              const CategoryIcon = CATEGORY_ICONS[group.icon] ?? Globe
              return (
              <div key={group.category}>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CategoryIcon className="h-5 w-5 text-blue-600" />
                  {group.category}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.resources.map((resource) => (
                    <a
                      key={resource.url}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Card className="h-full hover:shadow-md transition-shadow border hover:border-blue-300">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="font-medium text-gray-900 text-sm leading-snug">
                              {resource.name}
                            </span>
                            <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {resource.description}
                          </p>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}