import {
  BookOpen, Scale, Database, Globe, Newspaper, Shield,
  FileText, Users, Radio, Video, ExternalLink, Search,
  Mic, Camera, Brain, Map
} from 'lucide-react';

const resourceCategories = [
  {
    title: 'Law Enforcement Databases',
    icon: Shield,
    color: 'text-blue-400',
    resources: [
      { name: 'FBI Wanted List', desc: 'Current most wanted fugitives and missing persons' },
      { name: 'NamUs (National Missing & Unidentified)', desc: 'National database for missing persons and unidentified remains' },
      { name: 'VICAP (Violent Criminal Apprehension Program)', desc: 'FBI database linking violent crimes nationwide' },
      { name: 'National Sex Offender Registry', desc: 'Public registry searchable by location' },
      { name: 'DEA Most Wanted', desc: 'Drug Enforcement Administration fugitive list' },
    ]
  },
  {
    title: 'Court & Legal Records',
    icon: Scale,
    color: 'text-amber-400',
    resources: [
      { name: 'PACER (Public Access to Court Records)', desc: 'Federal court documents and case files' },
      { name: 'Court Listener', desc: 'Free legal opinions and court audio' },
      { name: 'State Court Records', desc: 'Links to individual state court record systems' },
      { name: 'Supreme Court Records', desc: 'Historical and current Supreme Court decisions' },
      { name: 'Justia', desc: 'Free case law and legal information' },
    ]
  },
  {
    title: 'Research & Archives',
    icon: BookOpen,
    color: 'text-green-400',
    resources: [
      { name: 'Newspapers.com', desc: 'Historical newspaper archive for primary sources' },
      { name: 'The Internet Archive', desc: 'Digital library of historical documents and media' },
      { name: 'Google Scholar', desc: 'Academic papers on criminology and forensic science' },
      { name: 'Library of Congress', desc: 'Primary source documents and historical records' },
      { name: 'JSTOR', desc: 'Academic journals on criminal justice' },
    ]
  },
  {
    title: 'Forensic Science',
    icon: Brain,
    color: 'text-purple-400',
    resources: [
      { name: 'Forensic Science International', desc: 'Leading journal in forensic sciences' },
      { name: 'GEDmatch', desc: 'Genetic genealogy tool used in cold case investigations' },
      { name: 'National Institute of Justice', desc: 'Forensic science research and resources' },
      { name: 'CODIS (FBI DNA Database)', desc: 'Combined DNA Index System information' },
      { name: 'AFIS Overview', desc: 'Automated Fingerprint Identification System resources' },
    ]
  },
  {
    title: 'Mapping & Location Tools',
    icon: Map,
    color: 'text-cyan-400',
    resources: [
      { name: 'Google Earth Historical Imagery', desc: 'View locations across different time periods' },
      { name: 'Property Records Lookup', desc: 'Search property ownership history' },
      { name: 'Census Records', desc: 'Historical population and demographic data' },
      { name: 'GIS Crime Mapping', desc: 'Geographic analysis tools for crime patterns' },
    ]
  },
  {
    title: 'Podcasting & Content Creation',
    icon: Mic,
    color: 'text-red-400',
    resources: [
      { name: 'Audacity', desc: 'Free open-source audio editing software' },
      { name: 'Descript', desc: 'AI-powered audio/video editing tool' },
      { name: 'Anchor/Spotify for Podcasters', desc: 'Free podcast hosting and distribution' },
      { name: 'Canva', desc: 'Design tool for podcast covers and social media graphics' },
      { name: 'Buzzsprout', desc: 'Podcast hosting with analytics and distribution' },
      { name: 'Riverside.fm', desc: 'Remote interview recording platform' },
    ]
  },
];

const trueCrimePodcasts = [
  { name: 'Serial', desc: 'Pioneering investigative journalism podcast' },
  { name: 'My Favorite Murder', desc: 'Comedy true crime with Georgia & Karen' },
  { name: 'Crime Junkie', desc: 'Weekly deep dives into true crime' },
  { name: 'Casefile', desc: 'Australian true crime with meticulous research' },
  { name: 'Sword and Scale', desc: 'Dark and detailed true crime storytelling' },
  { name: 'Criminal', desc: 'Stories of people who have done wrong or been wronged' },
];

export default function ResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Research Resources
        </h1>
        <p className="text-zinc-400">
          Curated databases, tools, and references for true crime research and content creation
        </p>
      </div>

      {/* Resource Categories */}
      <div className="space-y-8 mb-16">
        {resourceCategories.map((category) => {
          const Icon = category.icon;
          return (
            <section key={category.title}>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Icon size={20} className={category.color} />
                {category.title}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {category.resources.map((resource) => (
                  <div
                    key={resource.name}
                    className="group p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-xl
                             hover:border-zinc-700/50 hover:bg-zinc-900/80 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-white text-sm group-hover:text-red-400 transition-colors">
                        {resource.name}
                      </h3>
                      <ExternalLink size={12} className="text-zinc-600 shrink-0 mt-1" />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{resource.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* Recommended Podcasts */}
      <section className="mb-16">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Radio size={20} className="text-green-400" />
          Recommended True Crime Podcasts
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {trueCrimePodcasts.map(podcast => (
            <div key={podcast.name} className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800/50
                                             rounded-xl hover:border-zinc-700/50 transition-all">
              <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Mic size={18} className="text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">{podcast.name}</h3>
                <p className="text-xs text-zinc-400">{podcast.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ethics Reminder */}
      <section className="bg-gradient-to-br from-amber-950/20 to-zinc-900/50 border border-amber-900/20
                        rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Users size={20} className="text-amber-400" />
          Ethics & Responsibility
        </h2>
        <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
          <p>
            True crime content involves real people, real victims, and real families. As researchers and
            content creators, we have a responsibility to approach these stories with sensitivity and integrity.
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              Always center the victim's humanity, not just the sensational details of the crime.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              Verify facts from multiple sources before publishing or broadcasting.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              Respect the privacy and wishes of victims' families.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              Avoid glorifying perpetrators or treating crimes as entertainment.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              Include trigger warnings when discussing graphic content.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5">-</span>
              If you have information about an active case, contact law enforcement.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
