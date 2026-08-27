export default function DemoSection() {
  return (
    <section id="demo" style={{ background: 'var(--off-white)' }}>
      <div className="container">
        <div className="section-header">
          <h2>See Exitus in Action</h2>
          <p>New here? Watch these quick demos to see how Emap and Exitus work.</p>
        </div>
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
            paddingTop: '56.25%',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
          }}
        >
          <iframe
            src="https://www.youtube.com/embed/videoseries?list=PLW2zyFeVxNyY"
            title="Exitus Demo & How-To Playlist"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
