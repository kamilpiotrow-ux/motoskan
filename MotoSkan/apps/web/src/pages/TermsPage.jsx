import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Regulamin serwisu MotoSkan</title>
        <meta name="description" content="Regulamin korzystania z serwisu MotoSkan - warunki użytkowania, odpowiedzialność, ochrona danych." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link to="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors duration-200">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Powrót do strony głównej</span>
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8" style={{letterSpacing: '-0.02em'}}>
            Regulamin serwisu MotoSkan
          </h1>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Postanowienia ogólne</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Niniejszy regulamin określa zasady korzystania z serwisu MotoSkan, dostępnego pod adresem internetowym motoskan.pl. Serwis umożliwia użytkownikom analizę ogłoszeń sprzedaży pojazdów mechanicznych w celu uzyskania informacji pomocnych przy podejmowaniu decyzji zakupowych.
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                Korzystanie z serwisu MotoSkan oznacza akceptację niniejszego regulaminu. Jeśli nie akceptujesz któregokolwiek z postanowień regulaminu, nie korzystaj z serwisu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Cel i zakres usługi</h2>
              <p className="text-foreground leading-relaxed mb-4">
                MotoSkan to narzędzie analityczne, które na podstawie podanego przez użytkownika linku do ogłoszenia sprzedaży pojazdu generuje raport zawierający:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                <li>Analizę stanu technicznego pojazdu na podstawie dostępnych informacji</li>
                <li>Ocenę wiarygodności ogłoszenia i sprzedającego</li>
                <li>Porównanie ceny z rynkiem</li>
                <li>Sugestie pytań do sprzedającego</li>
                <li>Szacunkowe koszty eksploatacji</li>
                <li>Informacje o typowych problemach danego modelu</li>
              </ul>
              <p className="text-foreground leading-relaxed mb-4">
                Raport generowany jest automatycznie na podstawie analizy treści ogłoszenia, danych z publicznie dostępnych źródeł oraz algorytmów sztucznej inteligencji.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Wyłączenie odpowiedzialności</h2>
              <p className="text-foreground leading-relaxed mb-4">
                <strong>WAŻNE:</strong> Raporty generowane przez MotoSkan mają charakter wyłącznie informacyjny i pomocniczy. Nie stanowią one:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                <li>Ekspertyzy technicznej ani opinii rzeczoznawcy</li>
                <li>Gwarancji stanu technicznego pojazdu</li>
                <li>Rekomendacji zakupu lub odstąpienia od zakupu</li>
                <li>Podstawy do roszczeń wobec sprzedającego</li>
              </ul>
              <p className="text-foreground leading-relaxed mb-4">
                Właściciel serwisu nie ponosi odpowiedzialności za:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                <li>Decyzje zakupowe podjęte na podstawie raportu</li>
                <li>Niezgodność stanu faktycznego pojazdu z informacjami w raporcie</li>
                <li>Straty finansowe lub inne szkody wynikłe z korzystania z serwisu</li>
                <li>Błędy w analizie wynikające z niepełnych lub nieprawdziwych danych w ogłoszeniu</li>
                <li>Niedostępność serwisu lub błędy techniczne</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Obowiązki użytkownika</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Użytkownik zobowiązuje się do:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                <li>Korzystania z serwisu zgodnie z jego przeznaczeniem i obowiązującym prawem</li>
                <li>Niepodawania fałszywych lub wprowadzających w błąd informacji</li>
                <li>Niekorzystania z serwisu w sposób mogący zakłócić jego działanie</li>
                <li>Weryfikacji informacji z raportu u niezależnych specjalistów przed podjęciem decyzji zakupowej</li>
                <li>Przeprowadzenia osobistych oględzin pojazdu i jazdy próbnej</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Dane osobowe i prywatność</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Serwis MotoSkan przetwarza dane osobowe zgodnie z obowiązującymi przepisami o ochronie danych osobowych, w tym RODO. Szczegółowe informacje dotyczące przetwarzania danych osobowych znajdują się w Polityce Prywatności.
              </p>
              <p className="text-foreground leading-relaxed mb-4">
                Podane przez użytkownika linki do ogłoszeń są przetwarzane wyłącznie w celu wygenerowania raportu i nie są przechowywane dłużej niż jest to konieczne.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Ograniczenia gwarancji</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Serwis jest dostarczany w stanie "takim, jakim jest" (as is), bez jakichkolwiek gwarancji, wyraźnych lub dorozumianych, w tym gwarancji:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                <li>Dokładności i kompletności informacji</li>
                <li>Przydatności do określonego celu</li>
                <li>Nieprzerwanego działania</li>
                <li>Braku błędów</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Zalecenia</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Przed zakupem używanego pojazdu zalecamy:
              </p>
              <ul className="list-disc pl-6 mb-4 text-foreground leading-relaxed">
                <li>Zlecenie niezależnej ekspertyzy technicznej u certyfikowanego mechanika</li>
                <li>Sprawdzenie historii pojazdu w bazach danych (np. CEPiK, AutoDNA)</li>
                <li>Weryfikację dokumentacji pojazdu</li>
                <li>Przeprowadzenie jazdy próbnej</li>
                <li>Sprawdzenie pojazdu na podnośniku</li>
                <li>Konsultację z prawnikiem w przypadku wątpliwości dotyczących umowy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Zmiany regulaminu</h2>
              <p className="text-foreground leading-relaxed mb-4">
                Właściciel serwisu zastrzega sobie prawo do wprowadzania zmian w niniejszym regulaminie. Zmiany wchodzą w życie z chwilą ich publikacji na stronie serwisu. Dalsze korzystanie z serwisu po wprowadzeniu zmian oznacza akceptację nowego regulaminu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Kontakt</h2>
              <p className="text-foreground leading-relaxed mb-4">
                W sprawach dotyczących serwisu MotoSkan prosimy o kontakt poprzez formularz dostępny na stronie głównej serwisu.
              </p>
            </section>

            <section className="mb-8">
              <p className="text-sm text-muted-foreground">
                Ostatnia aktualizacja: 11 maja 2026
              </p>
            </section>
          </div>
        </main>

        <footer className="border-t border-border bg-card mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 <span className="font-semibold">Moto<span className="text-primary">Skan</span></span>
              </p>
              <Link to="/" className="text-sm text-primary hover:underline transition-all duration-200">
                Powrót do strony głównej
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default TermsPage;