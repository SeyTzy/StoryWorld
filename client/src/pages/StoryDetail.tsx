import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Eye, 
  Calendar, 
  Bookmark, 
  Star, 
  User, 
  MessageSquare, 
  Send, 
  ChevronRight, 
  Share2,
  CheckCircle,
  Play
} from 'lucide-react';
import { storyService } from '../services/storyService';
import { readerService } from '../services/readerService';
import { useAuthStore } from '../stores/authStore';
import { Story, Comment } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const StoryDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [story, setStory] = useState<Story | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchStoryDetail = async () => {
      try {
        setLoading(true);
        const data = await storyService.getStoryBySlug(slug);
        setStory(data);
        setIsBookmarked(data.isBookmarked || false);

        // Fetch comments
        const comms = await storyService.getStoryComments(data.id);
        setComments(comms);
      } catch (err) {
        console.error('Error fetching story:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoryDetail();
  }, [slug]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!story) return;

    try {
      if (isBookmarked) {
        await readerService.removeBookmark(story.id);
        setIsBookmarked(false);
      } else {
        await readerService.addBookmark(story.id);
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error updating bookmark:', err);
    }
  };

  const handleRating = async (ratingVal: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!story) return;

    try {
      setUserRating(ratingVal);
      await storyService.rateStory(story.id, ratingVal);
      // Refresh story to update average
      const updated = await storyService.getStoryBySlug(story.slug);
      setStory(updated);
    } catch (err) {
      console.error('Rating error:', err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!commentText.trim() || !story) return;

    try {
      setSubmittingComment(true);
      const newComment = await storyService.addComment(story.id, commentText.trim());
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return <LoadingSpinner text="កំពុងផ្ទុកទិន្នន័យរឿង..." className="py-32" />;
  }

  if (!story) {
    return (
      <div className="max-w-md mx-auto py-32 text-center">
        <h2 className="text-xl font-bold font-khmerTitle">រកមិនឃើញរឿងនេះទេ</h2>
        <p className="text-sm text-[#777777] mt-2">រឿងនេះប្រហែលជាត្រូវបានលុប ឬមិនទាន់បានបោះផ្សាយ។</p>
        <Link to="/explore" className="inline-block mt-4 px-6 py-2.5 bg-[#6C55D9] text-white rounded-xl text-sm font-medium">
          ត្រឡប់ទៅរុករករឿង
        </Link>
      </div>
    );
  }

  const coverUrl = story.coverImage
    ? story.coverImage.startsWith('http')
      ? story.coverImage
      : `/${story.coverImage.replace(/^\//, '')}`
    : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';

  const firstChapter = story.chapters && story.chapters.length > 0 ? story.chapters[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Story Hero Banner */}
      <div className="bg-[#F7F5F1] rounded-3xl p-6 sm:p-10 border border-[#EAEAEA]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Cover Image */}
          <div className="md:col-span-4 lg:col-span-3 flex justify-center">
            <div className="w-56 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-card border border-[#EAEAEA] bg-white relative">
              <img
                src={coverUrl}
                alt={story.title}
                className="w-full h-full object-cover"
              />
              {story.category && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#6C55D9] text-xs font-bold font-khmer shadow-sm">
                  {story.category.name}
                </span>
              )}
            </div>
          </div>

          {/* Details & Action */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-[#E9E5FA] text-[#6C55D9] text-xs font-semibold">
                  {story.status === 'PUBLISHED' ? 'បានបោះផ្សាយ' : 'ព្រាងទុក'}
                </span>
                <span className="text-xs text-[#777777] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(story.createdAt).toLocaleDateString('km-KH', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#242424] font-khmerTitle leading-tight">
                {story.title}
              </h1>

              <p className="text-base text-[#777777] mt-2 flex items-center gap-2 font-khmer">
                <User className="w-4 h-4 text-[#6C55D9]" />
                <span>និពន្ធដោយ៖ <strong className="text-[#242424]">{story.author}</strong></span>
              </p>
            </div>

            {/* Meta Stats Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#777777] pt-2 border-t border-[#EAEAEA]">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#6C55D9]" />
                <span>{story.chapters?.length || 0} ភាគ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#6C55D9]" />
                <span>{story.views.toLocaleString()} ដង</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{story.averageRating ? story.averageRating.toFixed(1) : '5.0'} / 5.0</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {firstChapter ? (
                <Link
                  to={`/stories/${story.slug}/chapters/${firstChapter.id}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#6C55D9] hover:bg-[#5841C5] text-white font-bold text-sm shadow-soft transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>ចាប់ផ្តើមអាន (ភាគ ១)</span>
                </Link>
              ) : (
                <button
                  disabled
                  className="px-6 py-3.5 rounded-2xl bg-gray-300 text-gray-500 font-bold text-sm cursor-not-allowed"
                >
                  មិនទាន់មានភាគនៅឡើយ
                </button>
              )}

              <button
                onClick={handleBookmarkToggle}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
                  isBookmarked
                    ? 'border-[#6C55D9] bg-[#E9E5FA] text-[#6C55D9]'
                    : 'border-[#EAEAEA] bg-white text-[#242424] hover:bg-gray-50'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'បានចំណាំ' : 'ចំណាំរឿងនេះ'}</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl border border-[#EAEAEA] bg-white text-[#242424] hover:bg-gray-50 text-sm font-medium transition-all"
                title="ចែករំលែក"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'បានចម្លងតំណភ្ជាប់!' : 'ចែករំលែក'}</span>
              </button>
            </div>

            {/* Rating Stars Input */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-xs text-[#777777] font-khmer">ផ្តល់ពិន្ទុរឿងនេះ៖</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                    title={`ផ្តល់ពិន្ទុ ${star} ផ្កាយ`}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        (userRating || Math.round(story.averageRating || 5)) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story Synopsis */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEAEA] shadow-soft space-y-4">
        <h2 className="text-xl font-bold text-[#242424] font-khmerTitle flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[#6C55D9]" />
          <span>សេចក្តីសង្ខេប</span>
        </h2>
        <div className="text-base text-[#444444] leading-relaxed whitespace-pre-line font-khmer">
          {story.description}
        </div>
      </section>

      {/* Chapters List */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEAEA] shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#242424] font-khmerTitle flex items-center gap-2">
            <span>បញ្ជីភាគទាំងអស់</span>
            <span className="text-sm px-2.5 py-0.5 rounded-full bg-[#E9E5FA] text-[#6C55D9]">
              {story.chapters?.length || 0}
            </span>
          </h2>
        </div>

        {story.chapters && story.chapters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {story.chapters.map((chap) => (
              <Link
                key={chap.id}
                to={`/stories/${story.slug}/chapters/${chap.id}`}
                className="p-4 rounded-2xl border border-[#EAEAEA] hover:border-[#6C55D9] hover:bg-[#F7F5F1] transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E9E5FA] text-[#6C55D9] font-bold text-xs flex items-center justify-center font-mono">
                    {chap.chapterNumber}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#242424] group-hover:text-[#6C55D9] font-khmer transition-colors">
                      {chap.title}
                    </h3>
                    <p className="text-[11px] text-[#777777]">
                      {new Date(chap.createdAt).toLocaleDateString('km-KH')}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#777777] group-hover:text-[#6C55D9] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#777777] italic font-khmer">មិនទាន់មានភាគត្រូវបានបញ្ចូលនៅឡើយទេ។</p>
        )}
      </section>

      {/* Comments & Discussion */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAEAEA] shadow-soft space-y-6">
        <h2 className="text-xl font-bold text-[#242424] font-khmerTitle flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#6C55D9]" />
          <span>មតិយោបល់របស់អ្នកអាន ({comments.length})</span>
        </h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              placeholder={isAuthenticated ? "សរសេរមតិយោបល់របស់អ្នកលើរឿងនេះ..." : "សូមចូលគណនីដើម្បីបញ្ចេញមតិយោបល់..."}
              disabled={!isAuthenticated}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-[#EAEAEA] focus:border-[#6C55D9] focus:outline-none text-sm placeholder:text-[#777777] resize-none"
            />
          </div>

          <div className="flex justify-between items-center">
            {!isAuthenticated ? (
              <p className="text-xs text-[#777777]">
                <Link to="/login" className="text-[#6C55D9] font-bold hover:underline">ចូលគណនី</Link> ដើម្បីបញ្ចេញមតិ
              </p>
            ) : (
              <p className="text-xs text-[#777777]">ចូលរួមចែករំលែកដោយសមរម្យ និងថ្លៃថ្នូរ</p>
            )}

            <button
              type="submit"
              disabled={!isAuthenticated || !commentText.trim() || submittingComment}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all ${
                isAuthenticated && commentText.trim() && !submittingComment
                  ? 'bg-[#6C55D9] hover:bg-[#5841C5] shadow-sm'
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{submittingComment ? 'កំពុងផ្ញើ...' : 'ផ្ញើមតិ'}</span>
            </button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4 pt-4 border-t border-[#EAEAEA]">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 rounded-2xl bg-[#F7F5F1] border border-[#EAEAEA] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#6C55D9] text-white flex items-center justify-center font-bold text-xs">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#242424] font-khmer">{comment.user.name}</p>
                      <p className="text-[11px] text-[#777777]">
                        {new Date(comment.createdAt).toLocaleDateString('km-KH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#333333] pl-10 font-khmer leading-relaxed">
                  {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#777777] text-center py-6 font-khmer">
              មិនទាន់មានមតិយោបល់នៅឡើយទេ។ ក្លាយជាអ្នកដំបូងគេដែលបញ្ចេញមតិ!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
