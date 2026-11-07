import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const Logo = () => (
  <img 
    src="/Design-kami-id-4.png" 
    alt="Logo Design Kami" 
    className="h-10 w-auto object-contain" 
  />
);

const BoomerangVideoBg = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  const lastTimeRef = useRef<number>(-1);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let captureActive = true;
    let rafId: number;
    let intervalId: number;

    const captureFrame = () => {
      if (!captureActive) return;
      
      // Capture frame if the video time has advanced
      if (video.currentTime !== lastTimeRef.current) {
        const aspect = video.videoHeight / video.videoWidth;
        const width = Math.min(960, video.videoWidth || 960);
        const height = width * aspect;

        if (width > 0 && height > 0) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width;
          tempCanvas.height = height;
          const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
          if (tempCtx) {
            tempCtx.drawImage(video, 0, 0, width, height);
            framesRef.current.push(tempCanvas);
            lastTimeRef.current = video.currentTime;
          }
        }
      }

      // Schedule next capture
      if ('requestVideoFrameCallback' in video) {
        (video as any).requestVideoFrameCallback(captureFrame);
      } else {
        rafId = requestAnimationFrame(captureFrame);
      }
    };

    const handlePlay = () => {
      if ('requestVideoFrameCallback' in video) {
        (video as any).requestVideoFrameCallback(captureFrame);
      } else {
        rafId = requestAnimationFrame(captureFrame);
      }
    };

    const handleEnded = () => {
      captureActive = false;
      cancelAnimationFrame(rafId);
      setIsReady(true);
      startBoomerang();
    };

    const startBoomerang = () => {
      const frames = framesRef.current;
      if (frames.length === 0) return;

      canvas.width = frames[0].width;
      canvas.height = frames[0].height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let frameIdx = 0;
      let direction = 1;

      // 30fps ping-pong loop
      intervalId = window.setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frames[frameIdx], 0, 0);

        frameIdx += direction;
        if (frameIdx >= frames.length - 1) {
          frameIdx = frames.length - 1;
          direction = -1; // reverse
        } else if (frameIdx <= 0) {
          frameIdx = 0;
          direction = 1; // forward
        }
      }, 1000 / 30);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);
    video.play().catch(e => console.log('Autoplay prevented:', e));

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      cancelAnimationFrame(rafId);
      clearInterval(intervalId);
      captureActive = false;
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 scale-[1.15] origin-top overflow-hidden bg-white">
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4"
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className={`w-full h-full object-cover object-top ${isReady ? 'hidden' : 'block'}`}
      />
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover object-top ${isReady ? 'block' : 'hidden'}`}
      />
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 sm:px-10 md:px-14 py-4 sm:py-5 flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <Logo />
      <span className="font-semibold text-base tracking-tight text-[#191919]">DesignKami.id</span>
    </div>
    <div className="hidden md:flex items-center gap-8">
      {['Pengalaman', 'Keahlian', 'Pendidikan', 'Kontak'].map(link => (
        <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-[#191919]/70 hover:text-[#191919] transition-colors duration-200">
          {link}
        </a>
      ))}
    </div>
    <div>
      <a href="#kontak" className="px-5 py-2.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200 inline-block">
        Hubungi Saya
      </a>
    </div>
  </nav>
);

const FeatureRow = ({ num, label }: { num: string, label: string }) => (
  <div className="group bg-[#F4F3F3] hover:bg-[#eaeaea] transition-all duration-200 cursor-pointer px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
    <div className="flex items-center">
      <span className="text-[#191919]/40 font-medium">{num}</span>
      <span className="mx-2 text-[#191919]/30">/</span>
      <span className="font-medium text-[#191919]">{label}</span>
    </div>
    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-0.5 transition-all duration-200" />
  </div>
);

export default function App() {
  useEffect(() => {
    // Inject exact fonts requested
    const style = document.createElement('style');
    style.innerHTML = `
      @import url('https://db.onlinewebfonts.com/c/9d4d074c9335825a23cce178ee03b498?family=P22+Mackinac+W01+Book');
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
      :root {
        --font-sans: 'Inter', sans-serif;
        --font-serif: 'P22 Mackinac W01 Book', Georgia, serif;
      }
      .font-sans { font-family: var(--font-sans); }
      .font-serif { font-family: var(--font-serif); }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans antialiased text-[#191919]">
      <BoomerangVideoBg />
      <Navbar />

      <main className="relative z-10 flex flex-col items-center h-screen">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center pt-24 sm:pt-26 md:pt-32 px-4 sm:px-6 w-full">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter text-[#191919] font-normal">
            DesignKami.id
          </h1>
          <p className="max-w-sm sm:max-w-md mt-5 sm:mt-6 md:mt-8 text-sm md:text-base text-[#191919]/70 leading-relaxed">
            Civil Engineer lulusan Universitas Muhammadiyah Sukabumi. Berpengalaman di bidang Estimator, Quality Control, Quantity Surveyor, dan Struktur. Tersertifikasi SKK Ahli Muda Bangunan Gedung.
          </p>
          <a href="#pengalaman" className="mt-6 sm:mt-8 md:mt-10 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#191919] text-white text-sm font-medium rounded-lg hover:bg-[#191919]/90 transition-colors duration-200 inline-block">
            Lihat Portofolio
          </a>
        </div>

        {/* Bottom Panel */}
        <div className="mt-auto w-full max-w-5xl px-4 sm:px-6">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 border-b-0 pt-8 sm:pt-12 md:pt-16 px-5 sm:px-8 md:px-12 pb-0 shadow-sm w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-16">
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#191919]/50 font-medium">TENTANG SAYA</span>
                <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-serif font-normal leading-tight tracking-tight text-[#191919]">
                  Perencanaan presisi, <br className="hidden sm:block" />hasil yang solid
                </h2>
              </div>
              <div className="flex items-end">
                <p className="text-sm md:text-[15px] text-[#191919]/70 leading-relaxed pb-1">
                  Berpengalaman mengerjakan berbagai proyek di bidang estimator, gambar rencana, dan struktur, baik dalam lingkup pemerintahan maupun swasta. Mahir menggunakan AutoCAD, SketchUp, ETABS, dan SAP2000.
                </p>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 md:mt-10 h-px bg-gray-200 w-full" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 py-6 sm:py-8">
               <FeatureRow num="01" label="Perencanaan & DED" />
               <FeatureRow num="02" label="Analisis & Desain Struktur" />
               <FeatureRow num="03" label="Sertifikasi Layak Fungsi (SLF)" />
            </div>
          </div>
        </div>
      </main>

      {/* --- SECTIONS TAMBAHAN DI BAWAH HERO --- */}
      <div className="relative z-10 bg-white">
        
        {/* PENGALAMAN SECTION */}
        <section id="pengalaman" className="w-full max-w-5xl mx-auto py-24 px-6 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-serif mb-12 text-[#191919]">Pengalaman Kerja Terkini</h2>
          
          <div className="space-y-10 text-[#191919]">
            {/* Pekerjaan 1 - Bamboo Rapublik */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/4 text-sm text-[#191919]/60 font-medium pt-1">Juni 2025 - Juli 2026</div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-medium mb-1">Tenaga Ahli Teknik Sipil (PBG & SLF)</h3>
                <div className="text-sm text-[#191919]/70 mb-3 font-medium">PT. Bamboo Rapublik Indonesia, Sukabumi</div>
                <p className="text-[15px] leading-relaxed text-[#191919]/80">
                  Bertanggung jawab dalam survey dan kajian pada pembuatan Sertifikasi Layak Fungsi (SLF) yang membandingkan DED dengan As-built dan memperhitungkan kembali desain struktur gedung Warehouse dan ruang kantor setelah pekerjaan pembangunan.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Pekerjaan 2 - Shoetown (Baru Ditambahkan) */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/4 text-sm text-[#191919]/60 font-medium pt-1">Feb 2022 - Jan 2026</div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-medium mb-1">Tenaga Ahli Teknik Sipil (Perencanaan, PBG & SLF)</h3>
                <div className="text-sm text-[#191919]/70 mb-3 font-medium">PT. Shoetown Ligung & Kasokandel Indonesia</div>
                <p className="text-[15px] leading-relaxed text-[#191919]/80">
                  Menangani lebih dari 7 proyek strategis berkelanjutan di kawasan industri PT. Shoetown. Bertanggung jawab atas pembuatan Detail Engineering Design (DED), Persetujuan Bangunan Gedung (PBG), serta kajian Sertifikasi Layak Fungsi (SLF) dengan membandingkan As-built dan menghitung ulang struktur untuk fasilitas Kawasan Industri, Gedung E3, Dormitory, RMCC, Klinik, dan Warehouse.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Pekerjaan 3 - Kemdikbud */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/4 text-sm text-[#191919]/60 font-medium pt-1">Agustus - Nov 2025</div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-medium mb-1">Tenaga Ahli Teknik Sipil (Perencanaan & Pengawasan)</h3>
                <div className="text-sm text-[#191919]/70 mb-3 font-medium">Kementerian Pendidikan Dasar dan Menengah</div>
                <p className="text-[15px] leading-relaxed text-[#191919]/80">
                  Perencanaan dan pengawasan Revitalisasi SDN Cipelang Gede & SDN Kopeng. Bertanggung jawab mulai dari survey awal, gambar kerja, perhitungan struktur, rencana anggaran biaya (RAB), hingga mengawasi mutu material dan laju pencapaian kemajuan fisik (progress) di lapangan.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Pekerjaan 4 - KSOP Marunda */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <div className="md:w-1/4 text-sm text-[#191919]/60 font-medium pt-1">Agustus - Des 2024</div>
              <div className="md:w-3/4">
                <h3 className="text-xl font-medium mb-1">Tenaga Ahli Teknik Sipil Pelaksana</h3>
                <div className="text-sm text-[#191919]/70 mb-3 font-medium">Kantor KSOP Marunda - Direktorat Jenderal Perhubungan Laut</div>
                <p className="text-[15px] leading-relaxed text-[#191919]/80">
                  Bertanggung jawab dalam pelaksanaan pembangunan rehabilitasi eksterior, interior, dan perluasan Gedung Operasional dan Pelayanan. Berfokus pada peningkatan team work, ketelitian, dan analisis data.
                </p>
              </div>
            </div>
            
            <div className="pt-4">
              <p className="text-sm text-[#191919]/50 italic">* Terdapat lebih dari 20+ pengalaman proyek perencanaan, pengawasan, dan sertifikasi (SLF) lainnya sejak 2019 dalam CV lengkap.</p>
            </div>
          </div>
        </section>

        {/* KEAHLIAN SECTION */}
        <section id="keahlian" className="w-full bg-[#F4F3F3]">
          <div className="max-w-5xl mx-auto py-24 px-6">
            <h2 className="text-3xl md:text-4xl font-serif mb-10 text-[#191919]">Keahlian & Kompetensi</h2>
            <div className="flex flex-wrap gap-3">
              {['AutoCAD', 'SketchUp', 'ETABS', 'SAP2000', 'Ms. Project', 'Manajemen Proyek', 'Analisis Struktur', 'Perancangan AHSP/RAB', 'SKK Ahli Muda K3 Konstruksi', 'SKK Ahli Muda Bangunan Gedung'].map(skill => (
                <span key={skill} className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-[#191919]/80 shadow-sm hover:border-gray-400 hover:text-black transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PENDIDIKAN SECTION */}
        <section id="pendidikan" className="w-full max-w-5xl mx-auto py-24 px-6 border-t border-gray-200">
          <h2 className="text-3xl md:text-4xl font-serif mb-10 text-[#191919]">Pendidikan</h2>
          <div className="space-y-8">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-[#191919]">S1 Teknik Sipil (IPK: 3.48)</h3>
              <p className="text-[#191919]/70 mt-1">Universitas Muhammadiyah Sukabumi • 2016 - 2020</p>
              <ul className="mt-4 space-y-2 text-sm text-[#191919]/70 list-disc list-inside">
                <li>Sekretaris Umum BEM Fakultas Sains & Teknologi (2018/2019)</li>
                <li>Sekretaris II Himpunan Mahasiswa Teknik Sipil (2017/2018)</li>
                <li>Ketua KKN Expo 2019</li>
              </ul>
            </div>
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-lg font-semibold text-[#191919]">Jurusan Ilmu Pengetahuan Alam (IPA)</h3>
              <p className="text-[#191919]/70 mt-1">SMA Negeri 1 Cibadak • 2013 - 2016</p>
            </div>
          </div>
        </section>

        {/* KONTAK SECTION */}
        <section id="kontak" className="w-full bg-[#191919] text-white">
          <div className="max-w-5xl mx-auto py-24 px-6">
            <h2 className="text-3xl md:text-4xl font-serif mb-10">Mari Berdiskusi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-white/70 leading-relaxed mb-8 text-[15px]">
                  Tertarik untuk bekerja sama, memiliki pertanyaan seputar proyek konstruksi, perencanaan struktur, atau perhitungan RAB? Jangan ragu untuk menghubungi saya melalui kontak di bawah ini.
                </p>
                <div className="space-y-4 text-[15px] text-white/90">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">📍</span>
                    <span>Sukabumi, Jawa Barat</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">✉️</span>
                    <a href="mailto:rizalfadillah@ummi.ac.id" className="hover:underline">rizalfadillah@ummi.ac.id</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">📞</span>
                    <span>+62 815 6160 366</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">📱</span>
                    <a href="https://instagram.com/itsmerzl_" target="_blank" rel="noreferrer" className="hover:underline">@itsmerzl_</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}