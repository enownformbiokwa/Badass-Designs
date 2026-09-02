import React, { useState, useEffect } from "react";
import { Star, MessageSquare, CheckCircle2, Send, Loader2 } from "lucide-react";
import { PieceReview } from "../types";

interface ReviewsSectionProps {
  pieceId: string;
  pieceName: string;
  initialReviews?: PieceReview[];
}

export function ReviewsSection({ pieceId, pieceName, initialReviews = [] }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<PieceReview[]>(initialReviews);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Form inputs
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");

  // Load reviews from API
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/reviews?pieceId=${pieceId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.reviews && Array.isArray(data.reviews)) {
          const combined = [...data.reviews];
          initialReviews.forEach((initRev) => {
            if (!combined.some((r) => r.reviewId === initRev.reviewId)) {
              combined.push(initRev);
            }
          });
          setReviews(combined);
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));

    return () => {
      isMounted = false;
    };
  }, [pieceId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setFormError("Please provide your name and review comment.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pieceId,
          pieceName,
          name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to submit review.");
      }

      setReviews((prev) => [result.review, ...prev]);
      setSuccessMessage("Your review is now live! Thank you.");
      setName("");
      setComment("");
      setRating(5);
      setTimeout(() => {
        setShowForm(false);
        setSuccessMessage("");
      }, 3000);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="space-y-4 pt-2">
      {/* Header with Average Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-neutral-900/60 border border-white/10 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-black font-display text-white">
            {avgRating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-white">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < Math.round(Number(avgRating)) ? "fill-white text-white" : "text-neutral-700"}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              Based on {reviews.length} verified review{reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold transition-colors cursor-pointer"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <form onSubmit={handleSubmitReview} className="p-4 bg-neutral-900 border border-white/15 rounded-xl space-y-3">
          <h4 className="font-display font-bold text-xs uppercase text-white">
            Leave Feedback for {pieceName}
          </h4>

          {formError && (
            <div className="p-2 bg-neutral-950 border border-red-500/40 rounded text-red-300 text-xs font-mono">
              {formError}
            </div>
          )}

          {successMessage && (
            <div className="p-2 bg-neutral-950 border border-white/40 rounded text-white text-xs font-mono flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-neutral-400">Your Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sandra E. (Douala)"
                className="w-full bg-neutral-950 border border-white/15 rounded-lg p-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-neutral-400">Rating</label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      size={18}
                      className={star <= rating ? "fill-white text-white" : "text-neutral-700"}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-neutral-400">Comment / Fit Impression *</label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How does the fabric feel? Fit silhouette, GSM weight..."
              className="w-full bg-neutral-950 border border-white/15 rounded-lg p-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold uppercase rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                <Send size={13} />
                <span>Submit Verified Review</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-2.5">
        {reviews.length === 0 ? (
          <div className="py-6 text-center text-xs font-mono text-neutral-500">
            No reviews yet. Be the first to review this piece!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.reviewId}
              className="p-3 bg-neutral-900/40 border border-white/10 rounded-xl space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-xs text-white">{rev.name}</span>
                  {rev.verified && (
                    <span className="text-[9px] font-mono text-neutral-400 border border-white/10 px-1 rounded flex items-center gap-1">
                      <CheckCircle2 size={9} />
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5 text-white">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={i < rev.rating ? "fill-white text-white" : "text-neutral-700"}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                "{rev.comment}"
              </p>

              <div className="text-[9px] font-mono text-neutral-500">
                {rev.createdAt}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
