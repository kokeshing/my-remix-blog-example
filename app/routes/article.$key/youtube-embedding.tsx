export function YouTubeEmbedding({ id }: { id: string }) {
  return (
    <div className="my-4 w-5/6" style={{ aspectRatio: '16 / 9' }}>
      <iframe
        className="h-full w-full"
        title="YouTubeの埋め込み動画"
        src={`https://www.youtube.com/embed/${id}`}
        allow="autoplay;
    encrypted-media"
        allowFullScreen
      ></iframe>
    </div>
  )
}
