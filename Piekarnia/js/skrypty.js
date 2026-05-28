document.addEventListener('DOMContentLoaded', () => {
    sprawdzCzyOtwarte();
    InicjalizujCookies();
    InicjalizujPowrotNaGore();
    InicjalizujTrybNocny();
    InicjalizujWalidacjeFormularza();
    InicjalizujOkienkaProduktow();
});

/* ==========================================================================
   1. STATUS OTWARCIA PIEKARNI
   ========================================================================== */
const sprawdzCzyOtwarte = () => {
    const statusBox = document.getElementById('status-piekarni');
    if (!statusBox) return;

    const teraz = new Date();
    const dzienTygodnia = teraz.getDay();
    const godzina = teraz.getHours();

    let czyOtwarte = false;
    let komunikat = '';

    if (dzienTygodnia >= 1 && dzienTygodnia <= 5) {
        if (godzina >= 6 && godzina < 18) {
            czyOtwarte = true;
            komunikat = '<strong>Teraz otwarte!</strong> Zapraszamy po \u015Bwie\u017Ce pieczywo do 18:00.';
        }
    } else if (dzienTygodnia === 6) {
        if (godzina >= 6 && godzina < 14) {
            czyOtwarte = true;
            komunikat = '<strong>Teraz otwarte!</strong> Zapraszamy po \u015Bwie\u017Ce pieczywo do 14:00.';
        }
    }

    if (czyOtwarte) {
        statusBox.innerHTML = komunikat;
        statusBox.style.color = '#2e7d32';
        statusBox.style.backgroundColor = '#e8f5e9';
    } else {
        statusBox.innerHTML = '<strong>Teraz zamkni\u0119te.</strong> Pieczemy dla Was chleb, zapraszamy od 6:00 rano!';
        statusBox.style.color = '#c62828';
        statusBox.style.backgroundColor = '#ffebee';
    }

    statusBox.style.padding = '15px 30px';
    statusBox.style.borderRadius = '12px';
    statusBox.style.marginTop = '30px';
    statusBox.style.marginBottom = '10px';
    statusBox.style.border = '1px solid currentColor';
    statusBox.style.textAlign = 'center';
    statusBox.style.maxWidth = '600px';
    statusBox.style.marginLeft = 'auto';
    statusBox.style.marginRight = 'auto';
    statusBox.style.fontWeight = '500';
};

/* ==========================================================================
   2. DYNAMICZNY PASEK COOKIES
   ========================================================================== */
const InicjalizujCookies = () => {
    if (localStorage.getItem('cookies-zaakceptowane')) return;

    const pasek = document.createElement('div');
    pasek.id = 'pasek-cookies';
    pasek.innerHTML = `
        <span>Nasza strona piekarni u\u017Cywa plik\u00F3w cookies w celach edukacyjnych i statystycznych.</span>
        <button id='AkceptujCookies'>Rozumiem</button>
    `;
    document.body.appendChild(pasek);

    document.getElementById('AkceptujCookies').addEventListener('click', () => {
        localStorage.setItem('cookies-zaakceptowane', 'true');
        pasek.remove();
    });
};

/* ==========================================================================
   3. PRZYCISK POWROTU NA GÓRÊ
   ========================================================================== */
const InicjalizujPowrotNaGore = () => {
    const przycisk = document.createElement('button');
    przycisk.id = 'btn-top';
    przycisk.innerHTML = '\u25B2';
    document.body.appendChild(przycisk);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            przycisk.classList.add('pokaz');
        } else {
            przycisk.classList.remove('pokaz');
        }
    });

    przycisk.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
};

/* ==========================================================================
   4. TRYB NOCNY
   ========================================================================== */
const InicjalizujTrybNocny = () => {
    const listaMenu = document.querySelector('.menu-glowne ul');
    if (!listaMenu) return;

    const nowyElementListy = document.createElement('li');

    const btnNoc = document.createElement('button');
    btnNoc.className = 'przelacznik-nocny';
    btnNoc.innerText = '\uD83C\uDF19 Tryb Nocny';

    nowyElementListy.appendChild(btnNoc);
    listaMenu.appendChild(nowyElementListy);

    if (localStorage.getItem('tryb-nocny') === 'aktywowany') {
        document.body.classList.add('tryb-nocny');
        btnNoc.innerText = '\u2600\uFE0F Tryb Dnia';
    }

    btnNoc.addEventListener('click', () => {
        document.body.classList.toggle('tryb-nocny');

        if (document.body.classList.contains('tryb-nocny')) {
            localStorage.setItem('tryb-nocny', 'aktywowany');
            btnNoc.innerText = '\u2600\uFE0F Tryb Dnia';
        } else {
            localStorage.setItem('tryb-nocny', 'dezaktywowany');
            btnNoc.innerText = '\uD83C\uDF19 Tryb Nocny';
        }
    });
};

/* ==========================================================================
   5. INTERAKTYWNE MODALE - SK£AD I PRZEKRÓJ PRODUKTÓW
   ========================================================================== */
const InicjalizujOkienkaProduktow = () => {
    const karty = document.querySelectorAll('.wypiek-karta');
    const modal = document.getElementById('okno-produktu');
    const przyciskZamknij = document.querySelector('.zamknij-modal');

    if (!modal || karty.length === 0) return;

    const mTytul = document.getElementById('modal-tytul');
    const mImg = document.getElementById('modal-img');
    const mSklad = document.getElementById('modal-sklad');
    const mAlergeny = document.getElementById('modal-alergeny');

    karty.forEach(karta => {
        karta.style.cursor = 'pointer';

        karta.addEventListener('click', () => {
            const nazwa = karta.getAttribute('data-nazwa');
            const sklad = karta.getAttribute('data-sklad');
            const alergeny = karta.getAttribute('data-alergeny');
            const fPrzekroj = karta.getAttribute('data-img-inside');

            mTytul.innerText = nazwa;
            mSklad.innerText = sklad;
            mAlergeny.innerText = alergeny;
            mImg.src = fPrzekroj;

            modal.classList.add('otwarty');
            document.body.style.overflow = 'hidden';
        });
    });

    const zamknijOkno = () => {
        modal.classList.remove('otwarty');
        document.body.style.overflow = 'auto';
    };

    if (przyciskZamknij) {
        przyciskZamknij.addEventListener('click', zamknijOkno);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            zamknijOkno();
        }
    });
};

/* ==========================================================================
   6. WALIDACJA FORMULARZA KONTAKTOWEGO
   ========================================================================== */
const InicjalizujWalidacjeFormularza = () => {
    const formularz = document.querySelector('form');
    if (!formularz) return;

    formularz.setAttribute('novalidate', true);

    formularz.addEventListener('submit', (e) => {
        e.preventDefault();

        document.querySelectorAll('.blad-walidacji').forEach(el => el.remove());
        document.querySelectorAll('.input-blad').forEach(el => el.classList.remove('input-blad'));

        let czyFormularzOk = true;

        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            PokazBlad(emailInput, 'Wprowad\u017A poprawny adres e-mail zawieraj\u0105cy znak @ oraz domen\u0119.');
            czyFormularzOk = false;
        }

        if (phoneInput && phoneInput.value.trim() !== '') {
            const phoneDigits = phoneInput.value.replace(/\D/g, '');
            if (phoneDigits.length < 9) {
                PokazBlad(phoneInput, 'Numer telefonu musi sk\u0142ada\u0107 si\u0119 z co najmniej 9 cyfr.');
                czyFormularzOk = false;
            }
        }

        if (messageInput.value.trim().length < 10) {
            PokazBlad(messageInput, 'Wiadomo\u015B\u0107 jest za kr\u00F3tka. Napisz minimum 10 znak\u00F3w.');
            czyFormularzOk = false;
        }

        if (czyFormularzOk) {
            alert('Sukces! Formularz zosta\u0142 zweryfikowany pomy\u015Blnie i wys\u0142any.');
            formularz.reset();
        }
    });
};

const PokazBlad = (inputElement, trescBledu) => {
    inputElement.classList.add('input-blad');
    const kontenerBledu = document.createElement('span');
    kontenerBledu.className = 'blad-walidacji';
    kontenerBledu.innerText = trescBledu;
    inputElement.parentNode.appendChild(kontenerBledu);
};