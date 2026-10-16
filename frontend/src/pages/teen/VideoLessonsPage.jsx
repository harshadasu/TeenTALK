import React, { useState } from 'react';
import { PlayCircle, Youtube, Shield, Smartphone, Heart, Globe } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

const VIDEO_LESSONS = [
  {
    id: 1,
    title: 'Good Touch & Bad Touch',
    description:
      'Learn the difference between safe and unsafe physical contact, how to speak up, and who to trust when you feel uncomfortable.',
    youtubeId: 'gsqk3NkVwOc',
    category: 'Personal Safety',
    categoryColor: 'primary',
    icon: Shield,
    color: 'teal',
  },
  {
    id: 2,
    title: 'Personal Boundaries',
    description:
      'Understand what personal boundaries are, why they matter, and how to set and respect them in friendships and relationships.',
    youtubeId: 'T3dHyARt2ZA',
    category: 'Boundaries',
    categoryColor: 'blue',
    icon: Shield,
    color: 'blue',
  },
  {
    id: 3,
    title: 'Cyberbullying Awareness',
    description:
      'Recognise the signs of cyberbullying, learn how to protect yourself online, and find out how to get help if it happens to you.',
    youtubeId: 'mrIDZX9NsmM',
    category: 'Cyber Safety',
    categoryColor: 'red',
    icon: Smartphone,
    color: 'rose',
  },
  {
    id: 4,
    title: 'Social Media & Online Safety',
    description:
      'Stay safe on social media: manage privacy settings, spot fake profiles, and make smart choices about what you share online.',
    youtubeId: 'X9Htg8V3eik',
    category: 'Online Safety',
    categoryColor: 'purple',
    icon: Globe,
    color: 'purple',
  },
  {
    id: 5,
    title: 'Stress & Emotional Well-being',
    description:
      'Discover healthy ways to handle stress, understand your emotions, and build resilience for a happier, balanced life.',
    youtubeId: 'Nlz8yKG0ySU',
    category: 'Mental Health',
    categoryColor: 'green',
    icon: Heart,
    color: 'emerald',
  },
];

const colorMap = {
  teal:    { bg: 'bg-teal-50',    icon: 'bg-teal-600',    badge: 'text-teal-700 bg-teal-50 border-teal-200' },
  blue:    { bg: 'bg-blue-50',    icon: 'bg-blue-600',    badge: 'text-blue-700 bg-blue-50 border-blue-200' },
  rose:    { bg: 'bg-rose-50',    icon: 'bg-rose-600',    badge: 'text-rose-700 bg-rose-50 border-rose-200' },
  purple:  { bg: 'bg-purple-50',  icon: 'bg-purple-600',  badge: 'text-purple-700 bg-purple-50 border-purple-200' },
  emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-600', badge: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
};

export const VideoLessonsPage = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Safety Video Lessons
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Watch expert-curated videos on personal safety, online well-being, and emotional health.
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {VIDEO_LESSONS.map((video) => {
          const colors = colorMap[video.color];
          const Icon = video.icon;
          const isActive = activeVideo === video.id;

          return (
            <Card key={video.id} hoverEffect className="flex flex-col overflow-hidden p-0">
              {/* Thumbnail / Player area */}
              <div className={`relative w-full aspect-video ${colors.bg} flex items-center justify-center`}>
                {isActive ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    {/* YouTube thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Play overlay */}
                    <button
                      onClick={() => setActiveVideo(video.id)}
                      className="relative z-10 flex flex-col items-center gap-2 group"
                      aria-label={`Play ${video.title}`}
                    >
                      <div className={`w-16 h-16 rounded-full ${colors.icon} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <PlayCircle className="w-9 h-9" />
                      </div>
                      <span className="text-xs font-bold text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        Watch Now
                      </span>
                    </button>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-lg ${colors.icon} text-white`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                    {video.category}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">{video.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed flex-1">{video.description}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
                  >
                    <Youtube className="w-4 h-4 text-rose-500" />
                    Open in YouTube
                  </a>
                  {!isActive && (
                    <button
                      onClick={() => setActiveVideo(video.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-bold ${colors.icon.replace('bg-', 'text-')} hover:underline`}
                    >
                      <PlayCircle className="w-4 h-4" />
                      Play here
                    </button>
                  )}
                  {isActive && (
                    <button
                      onClick={() => setActiveVideo(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-700"
                    >
                      Close player
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Note */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-start gap-3">
        <Youtube className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-slate-800">All videos are hosted on YouTube</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Content is curated for age-appropriate safety education. Videos open directly in this page or
            in a new tab on YouTube.
          </p>
        </div>
      </div>
    </div>
  );
};
