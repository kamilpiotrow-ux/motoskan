import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Download, AlertCircle } from 'lucide-react';

function HomePage() {
  const [url, setUrl] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  const [checkboxes, setCheckboxes] = useState({
    engine: true,
    transmission: true,
    suspension: true,
    body: true,
    contentAnalysis: true,
    mileageAssessment: true,
    priceAnalysis: true,
    seller: true,
    questions: true,
    operatingCosts: true,
  });

  const loadingMessages = [
    "Pobieram treść ogłoszenia...",
    "Identyfikuję model, rocznik i wersję wyposażenia...",
    "Sprawdzam specyfikację fabryczną dla tego wariantu...",
    "Analizuję silnik — pojemność, moc, typ wtrysku...",
    "Weryfikuję skrzynię biegów i napęd...",
    "Szukam znanych usterek tego silnika w tej generacji...",
    "Sprawdzam podatność nadwozia na korozję i typowe słabe punkty...",
    "Przeszukuję fora motoryzacyjne i raporty warsztatów...",
    "Agreguję opinie mechaników (tak, naprawdę 😉)...",
    "Sprawdzam typowe koszty eksploatacji i części zamiennych...",
    "Weryfikuję dane o niezawodności z rankingów TÜV i ADAC...",
    "Oceniam przebieg względem wieku i typu eksploatacji...",
    "Analizuję cenę na tle aktualnych ofert na rynku...",
    "Sprawdzam, czy cena uwzględnia aktualny kurs części...",
    "Oceniam jakość i kompletność ogłoszenia...",
    "Szukam czerwonych flag w treści opisu...",
    "Analizuję spójność danych między ogłoszeniem a specyfikacją produkcyjną...",
    "Sprawdzam, czego sprzedający woli nie napisać... 🔍",
    "Przygotowuję listę pytań, które warto zadać sprzedającemu...",
    "Weryfikuję końcowe wnioski i przypisuję źródła...",
    "Finalizuję raport analizy...",
  ];

  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) {
      setElapsed(0);
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading]);

  const formatTime = (tenths) => {
    const totalSeconds = Math.floor(tenths / 10);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const frac = tenths % 10;
    return `${mins}:${String(secs).padStart(2, '0')}.${frac}`;
  };

  const handleCheckboxChange = (key) => {
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAnalyze = async () => {
    if (!url.trim() || !termsAccepted) return;

    const WORKER_URL = 'https://motoskan-jobs.kamilpiotrow.workers.dev';

    // ⚠️ FAZA 5: Podmień ten URL na nowy webhook z self-hosted n8n
    const WEBHOOK_URL = 'https://TWOJ-N8N.motoskan.pl/webhook/WEBHOOK-ID-Z-N8N';

    const jobId = 'job_' + btoa(url.trim()).replace(/[^a-z0-9]/gi, '');

    setIsLoading(true);
    setError(null);
    setReportData(null);
    setLoadingMessageIndex(0);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) throw new Error('Błąd połączenia z serwerem.');

      const deadline = Date.now() + 6 * 60 * 1000;
      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, 5000));
        const poll = await fetch(`${WORKER_URL}?jobId=${jobId}`);
        const pollData = await poll.json();

        if (pollData.status === 'done') {
          let processedText = pollData.result;
          processedText = processedText.replace(/\\n/g, '\n').replace(/\\"/g, '"');
          const trimmed = processedText.trim();
          if (trimmed.startsWith('[') || trimmed.startsWith('{') || trimmed.startsWith('"')) {
            const firstHash = processedText.indexOf('#');
            if (firstHash !== -1) processedText = processedText.substring(firstHash);
          }
          processedText = processedText
            .replace(/"]$/, '').replace(/"}$/, '')
            .replace(/\]$/, '').replace(/}$/, '');
          setReportData(processedText);
          setIsLoading(false);
          return;
        }
      }
      setError('Analiza przekroczyła limit czasu (6 minut). Spróbuj ponownie.');
    } catch (err) {
      setError('Przepraszamy, wystąpił błąd. Spróbuj ponownie.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // ── parseReport: wszystkie 11 sekcji raportu ──────────────────────────────
  const parseReport = (markdown) => {
    if (!markdown) return null;

    const lines = markdown.split('\n');
    let title = 'Raport analizy pojazdu';
    let overallRating = '🟡';
    let overallSummary = '';

    // rating: '🔴'|'🟡'|'🟢' → pojawia się w kafelkach z kolorem
    // rating: null → sekcja bez emoji (renderowana tylko w szczegółach, bez kafelka)
    const categories = [
      { id: 'engine',          name: 'Silnik',                        keywords: ['SILNIK'],                                    rating: '🟡', content: '' },
      { id: 'transmission',    name: 'Skrzynia biegów',               keywords: ['SKRZYNIA BIEGÓW', 'SKRZYNIA'],               rating: '🟡', content: '' },
      { id: 'suspension',      name: 'Zawieszenie',                   keywords: ['ZAWIESZENIE'],                               rating: '🟡', content: '' },
      { id: 'body',            name: 'Nadwozie',                      keywords: ['NADWOZIE', 'KAROSERIA'],                     rating: '🟡', content: '' },
      { id: 'contentAnalysis', name: 'Analiza treści ogłoszenia',     keywords: ['ANALIZA TREŚCI', 'TREŚCI OGŁOSZENIA'],       rating: '🟡', content: '' },
      { id: 'mileage',         name: 'Ocena przebiegu',               keywords: ['OCENA PRZEBIEGU', 'PRZEBIEGU'],             rating: '🟡', content: '' },
      { id: 'price',           name: 'Analiza ceny',                  keywords: ['ANALIZA CENY'],                              rating: '🟡', content: '' },
      { id: 'seller',          name: 'Wiarygodność sprzedającego',    keywords: ['WIARYGODNOŚĆ', 'WIARYGODNOSC'],              rating: '🟡', content: '' },
      { id: 'questions',       name: 'O co zapytać sprzedającego',    keywords: ['O CO ZAPYTAĆ', 'ZAPYTAĆ SPRZEDAJ'],          rating: null,  content: '' },
      { id: 'costs',           name: 'Koszty eksploatacji',           keywords: ['KOSZTY EKSPLOATACJI'],                      rating: null,  content: '' },
      { id: 'summary',         name: 'Podsumowanie',                  keywords: ['PODSUMOWANIE'],                              rating: null,  content: '' },
    ];

    let currentSection = 'intro';
    let currentCategoryIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('# ') && currentSection === 'intro') {
        title = line.replace(/^#\s*/, '').replace(/^Analiza:\s*/i, '').trim();
        continue;
      }

      if (line.startsWith('## ')) {
        const headerText = line.toUpperCase();

        if (headerText.includes('OCENA OGÓLNA')) {
          currentSection = 'overall';
          const match = line.match(/([🔴🟡🟢])/);
          if (match) overallRating = match[1];
          continue;
        }

        let foundCategory = false;
        for (let j = 0; j < categories.length; j++) {
          if (categories[j].keywords.some(kw => headerText.includes(kw))) {
            currentSection = 'category';
            currentCategoryIndex = j;
            // Wyciągnij emoji z nagłówka (jeśli jest) i zaktualizuj rating
            if (categories[j].rating !== null) {
              const match = line.match(/([🔴🟡🟢])/);
              if (match) categories[j].rating = match[1];
            }
            foundCategory = true;
            break;
          }
        }

        if (!foundCategory) {
          currentSection = 'other';
        }
        continue;
      }

      if (currentSection === 'overall' && line) {
        overallSummary += line + '\n';
      } else if (currentSection === 'category' && currentCategoryIndex !== -1) {
        categories[currentCategoryIndex].content += line + '\n';
      }
    }

    return {
      title,
      overallRating,
      overallSummary: overallSummary.trim(),
      // Kafelki (grid): tylko sekcje z emoji i z treścią
      tiles: categories.filter(c => c.rating !== null && c.content.trim() !== ''),
      // Szczegóły: wszystkie sekcje z treścią
      sections: categories.filter(c => c.content.trim() !== ''),
    };
  };

  const getRiskDetails = (emoji) => {
    switch (emoji) {
      case '🔴': return { text: 'Wysokie ryzyko', colorClass: 'negative' };
      case '🟢': return { text: 'Niskie ryzyko',  colorClass: 'positive' };
      case '🟡':
      default:   return { text: 'Średnie ryzyko', colorClass: 'neutral'  };
    }
  };

  const parsedData = parseReport(reportData);

  return (
    <>
      <Helmet>
        <title>MotoSkan – Co wiadomo o aucie z tego ogłoszenia?</title>
        <meta name="description" content="Analizuj ogłoszenia samochodowe przed zakupem. Sprawdź stan techniczny, cenę i historię pojazdu." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-white no-print">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <img
              src="/white_2.png"
              alt="MotoSkan"
              className="h-24 md:h-32 mb-4 object-contain"
            />
            <p className="text-lg text-muted-foreground">
              Co wiadomo o aucie z tego ogłoszenia?
            </p>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {!reportData && !isLoading && (
            <div className="no-print">
              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="link">Wklej link</TabsTrigger>
                  <TabsTrigger value="text">Wklej tekst ogłoszenia</TabsTrigger>
                  <TabsTrigger value="photo">Wgraj zdjęcie</TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="space-y-6">
                  <div>
                    <label htmlFor="url-input" className="block text-sm font-medium text-foreground mb-2">
                      Link do ogłoszenia
                    </label>
                    <textarea
                      id="url-input"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.otomoto.pl/..."
                      className="w-full min-h-[120px] px-4 py-3 border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-foreground mb-4">
                      Wybierz elementy do analizy
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.engine} onCheckedChange={() => handleCheckboxChange('engine')} />
                          <span className="text-sm text-foreground">Silnik</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.transmission} onCheckedChange={() => handleCheckboxChange('transmission')} />
                          <span className="text-sm text-foreground">Skrzynia biegów</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.suspension} onCheckedChange={() => handleCheckboxChange('suspension')} />
                          <span className="text-sm text-foreground">Zawieszenie</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.body} onCheckedChange={() => handleCheckboxChange('body')} />
                          <span className="text-sm text-foreground">Nadwozie</span>
                        </label>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.contentAnalysis} onCheckedChange={() => handleCheckboxChange('contentAnalysis')} />
                          <span className="text-sm text-foreground">Analiza treści ogłoszenia</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.mileageAssessment} onCheckedChange={() => handleCheckboxChange('mileageAssessment')} />
                          <span className="text-sm text-foreground">Ocena przebiegu</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.priceAnalysis} onCheckedChange={() => handleCheckboxChange('priceAnalysis')} />
                          <span className="text-sm text-foreground">Analiza ceny</span>
                        </label>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.seller} onCheckedChange={() => handleCheckboxChange('seller')} />
                          <span className="text-sm text-foreground">Wiarygodność sprzedającego</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.questions} onCheckedChange={() => handleCheckboxChange('questions')} />
                          <span className="text-sm text-foreground">O co zapytać sprzedającego</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <Checkbox checked={checkboxes.operatingCosts} onCheckedChange={() => handleCheckboxChange('operatingCosts')} />
                          <span className="text-sm text-foreground">Koszty eksploatacji</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="flex items-start gap-3 cursor-pointer mb-6">
                      <Checkbox checked={termsAccepted} onCheckedChange={setTermsAccepted} />
                      <span className="text-sm text-foreground">
                        Korzystając z serwisu akceptuję{' '}
                        <Link to="/regulamin" className="text-primary hover:underline transition-all duration-200">
                          Regulamin
                        </Link>
                      </span>
                    </label>

                    <Button
                      onClick={handleAnalyze}
                      disabled={!termsAccepted || !url.trim()}
                      className={`w-full transition-all duration-200 ${
                        !termsAccepted || !url.trim()
                          ? 'bg-muted-foreground/30 text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      Analizuj ogłoszenie
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="space-y-6">
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">Funkcja dostępna wkrótce</p>
                  </div>
                </TabsContent>

                <TabsContent value="photo" className="space-y-6">
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground">Funkcja dostępna wkrótce</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* ── LOADER ── */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 no-print">
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
              <p className="text-lg text-foreground font-medium text-center max-w-md mb-3">
                {loadingMessages[loadingMessageIndex]}
              </p>
              <p className="text-3xl font-mono font-bold text-primary mb-6 tabular-nums">
                {formatTime(elapsed)}
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
                Średni czas wygenerowania pełnego raportu to ok.&nbsp;3&nbsp;minuty.
                Czas zależy od ilości dostępnych danych nt. awaryjności i usterkowości konkretnego modelu.
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-6 bg-destructive/10 border border-destructive/20 rounded-lg no-print">
              <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
              <p className="text-foreground">{error}</p>
            </div>
          )}

          {parsedData && !isLoading && (
            <div id="report-content" className="space-y-10">
              <div className="no-print mb-8">
                <Button
                  onClick={() => { setReportData(null); setUrl(''); setError(null); }}
                  variant="outline"
                  className="transition-all duration-200"
                >
                  Analizuj kolejne ogłoszenie
                </Button>
              </div>

              {/* Tytuł */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>
                  {parsedData.title}
                </h1>
              </div>

              {/* Kafelek Ocena ogólna */}
              <div className={`rounded-2xl p-6 md:p-8 report-tile-${getRiskDetails(parsedData.overallRating).colorClass}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`report-dot report-dot-${getRiskDetails(parsedData.overallRating).colorClass}`}></span>
                  <span className="text-sm font-bold tracking-wider uppercase text-foreground/80">Ocena ogólna</span>
                </div>
                <p className="text-xl md:text-2xl font-semibold text-foreground mb-4 leading-snug">
                  {parsedData.overallSummary || 'Brak podsumowania ogólnego.'}
                </p>
                <p className="text-sm text-foreground/60">szczegóły poniżej</p>
              </div>

              {/* Grid kafelków — tylko sekcje z emoji */}
              {parsedData.tiles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parsedData.tiles.map((cat, idx) => {
                    const risk = getRiskDetails(cat.rating);
                    return (
                      <div key={idx} className="bg-white border border-border rounded-xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`report-dot report-dot-${risk.colorClass}`}></span>
                          <h3 className="font-semibold text-foreground">{cat.name}</h3>
                        </div>
                        <p className={`text-sm font-medium report-text-${risk.colorClass}`}>
                          {risk.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="report-separator"></div>

              {/* Szczegółowe sekcje — wszystkie (z i bez emoji) */}
              <div className="space-y-12">
                {parsedData.sections.map((cat, idx) => {
                  const hasRating = cat.rating !== null;
                  const risk = hasRating ? getRiskDetails(cat.rating) : null;
                  return (
                    <div key={idx} className="scroll-mt-8">
                      <div className="flex items-center gap-4 mb-6 flex-wrap">
                        <h2 className="text-2xl font-bold text-foreground">{cat.name}</h2>
                        {hasRating && risk && (
                          <span className={`report-badge report-badge-${risk.colorClass}`}>
                            <span className={`report-dot report-dot-${risk.colorClass}`}></span>
                            {risk.text}
                          </span>
                        )}
                      </div>
                      <div
                        className="report-content"
                        dangerouslySetInnerHTML={{ __html: window.marked ? window.marked.parse(cat.content) : cat.content }}
                      />
                      {idx < parsedData.sections.length - 1 && (
                        <div className="report-separator"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Stopka raportu */}
              <div className="border-t border-border pt-8 mt-12 no-print">
                <Button
                  onClick={handlePrintReport}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 mb-6"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Pobierz raport PDF
                </Button>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Zastrzeżenie:</strong> Niniejszy raport ma charakter wyłącznie informacyjny i nie stanowi ekspertyzy technicznej ani opinii rzeczoznawcy. Przed zakupem pojazdu zalecamy przeprowadzenie niezależnej inspekcji technicznej u certyfikowanego mechanika oraz weryfikację historii pojazdu w odpowiednich bazach danych. Właściciel serwisu nie ponosi odpowiedzialności za decyzje zakupowe podjęte na podstawie tego raportu.
                </p>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-border bg-card mt-16 no-print">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 <span className="font-semibold">Moto<span className="text-primary">Skan</span></span>
              </p>
              <div className="flex gap-6">
                <Link to="/regulamin" className="text-sm text-muted-foreground hover:text-primary transition-all duration-200">
                  Regulamin
                </Link>
              </div>
            </div>
            <div className="mt-6 text-sm text-muted-foreground leading-relaxed">
              <p>
                Analiza MotoSkan ma charakter wyłącznie informacyjny. Wynik analizy powstaje przy użyciu narzędzi sztucznej inteligencji, których zadaniem jest przeszukanie publicznie dostępnych informacji o danym modelu pojazdu — jego awaryjności, historii technicznej i rynkowej — oraz odniesienie ich do konkretnego ogłoszenia, z uwzględnieniem roku produkcji, przebiegu i ceny. Właściciel serwisu nie ponosi odpowiedzialności za decyzje podjęte na podstawie treści raportu. Przed zakupem pojazdu zalecamy fizyczną inspekcję przez uprawnionego diagnostę.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
