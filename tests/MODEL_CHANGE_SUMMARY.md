# 🔄 ZMIANA MODELU GEMINI - ROZWIĄZANIE QUOTA PROBLEM

**Data:** October 15, 2025  
**Problem:** Quota exceeded - 51/50 requests per day

---

## ❌ STARY MODEL: `gemini-2.0-flash-exp`

```
RPM: 10 requests per minute
TPM: 250K tokens per minute
RPD: 50 requests per day ❌ (TOO LOW!)
Status: 51/50 (EXCEEDED!)
```

**Problem:** Wykorzystano wszystkie 50 zapytań dziennie podczas testów.

---

## ✅ NOWY MODEL: `gemini-2.5-flash`

```
RPM: 10 requests per minute
TPM: 250K tokens per minute
RPD: 250 requests per day ✅ (5X MORE!)
Status: 0/250 (FRESH!)
```

**Zalety:**

- 🚀 **5x większy limit dzienny** (250 vs 50)
- ✅ Wystarczy na 100+ testów
- ✅ Wystarczy na normalny użytek przez cały dzień
- ✅ Ta sama jakość odpowiedzi (2.5 vs 2.0 = newer!)
- ✅ Takie same limity RPM/TPM

---

## 🔧 ZMIANY W KODZIE

### Plik: `src/app/api/chat/route.ts`

**Lokalizacja #1** (linia ~205) - Tutoring mode:

```typescript
// PRZED:
model: 'gemini-2.0-flash-exp',

// PO:
model: 'gemini-2.5-flash',
```

**Lokalizacja #2** (linia ~434) - General chat mode:

```typescript
// PRZED:
model: 'gemini-2.0-flash-exp',

// PO:
model: 'gemini-2.5-flash',
```

---

## 📊 PORÓWNANIE LIMITÓW WSZYSTKICH MODELI

| Model                   | RPD (Requests/Day) | Uwagi                           |
| ----------------------- | ------------------ | ------------------------------- |
| `gemini-2.0-flash-exp`  | **50** ❌          | Stary model - za mało!          |
| `gemini-2.0-flash-lite` | **200** ✅         | Dobry backup                    |
| `gemini-2.0-flash`      | **200** ✅         | Dobry backup                    |
| **`gemini-2.5-flash`**  | **250** ⭐         | **WYBRANY - NAJLEPSZY!**        |
| `gemini-2.5-flash-lite` | **1000** 🚀        | Backup jeśli quota znów problem |
| `gemini-2.5-pro`        | **50** ❌          | Pro ale mały limit              |

---

## ✅ OCZEKIWANE REZULTATY

### Przed zmianą:

- ❌ 10 testów z quota exceeded (429 errors)
- ❌ Math questions: 0/4
- ❌ English questions: 0/2
- ❌ FAQ with AI: 0/3

### Po zmianie:

- ✅ Wszystkie testy powinny działać
- ✅ Math questions: 4/4 expected
- ✅ English questions: 2/2 expected
- ✅ FAQ with AI: 3/3 expected
- 🎯 **Target pass rate: 90%+**

---

## 🚀 NASTĘPNE KROKI

1. ✅ **Model zmieniony** - `gemini-2.5-flash`
2. ⏳ **Restart dev server** - żeby zmiany zadziałały
   ```bash
   npm run dev
   ```
3. ⏳ **Re-run testów** - od początku
   ```bash
   npm run test:chatbot
   ```
4. ⏳ **Analiza wyników** - sprawdzić czy quota problem zniknął

---

## 💡 BACKUP PLAN

Jeśli `gemini-2.5-flash` też się skończy (mało prawdopodobne z 250 limitem):

**Plan B:** `gemini-2.5-flash-lite`

- 1000 requests/day!
- Nieco niższa jakość ale wystarczy do testów

**Plan C:** `gemini-2.0-flash-lite` lub `gemini-2.0-flash`

- 200 requests/day każdy
- Dobra jakość

---

## 📝 NOTATKI

### Dlaczego nie Pro?

`gemini-2.5-pro` ma tylko **50 RPD** - tyle samo co exp!  
Flash jest szybszy i ma większy limit.

### Czy stracę na jakości?

NIE! `gemini-2.5-flash` to NOWSZA wersja niż `2.0-flash-exp`.  
Flash = fast, nie znaczy gorszy. Pro vs Flash to trade-off speed vs complexity.

### Co z kosztami?

Free tier! Wszystkie wymienione modele są darmowe w tych limitach.

---

_Zmiana wykonana - gotowe do testowania!_ ✅
