# KODO — Algoritmo de Decisão (Next Right Action)

## Objetivo do algoritmo

Responder de forma clara e justificável:

> **“Qual é a ação correta para eu fazer agora?”**

Não é o que o usuário *quer* fazer.
É o que **mais contribui** para seus objetivos, **dado o contexto atual**.

---

## 🧠 Princípio central

> **Decisão = Impacto × Urgência × Alinhamento × Energia**

O algoritmo **pontua ações** e escolhe **uma única ação** com maior score.

---

## 🧩 Entidades envolvidas

### Action (ação candidata)

* Pode vir de:

  * disciplina (Studies)
  * objetivo (Path)
  * tarefa pessoal

Cada ação tem:

* duração estimada
* dificuldade
* energia necessária
* impacto esperado
* contexto de origem

---

## ⚙️ Variáveis do score

### 1️⃣ Urgência (U)

Quanto mais próximo o prazo, maior o peso.

```
U = 1 / (days_to_deadline + 1)
```

Sem prazo definido → valor baixo, mas não zero.

---

### 2️⃣ Impacto (I)

Quanto essa ação afeta algo importante.

Fontes de impacto:

* disciplina em risco alto
* objetivo estratégico
* avaliação de alto peso

Exemplo de escala:

```
Low    = 0.4
Medium = 0.7
High   = 1.0
```

---

### 3️⃣ Alinhamento com Path (A)

Quantos Paths importantes essa ação fortalece.

```
A = 1 + (0.3 × number_of_related_paths)
```

Ação ligada a nenhum Path:

```
A = 1.0
```

Ação ligada a 2 Paths:

```
A = 1.6
```

---

### 4️⃣ Energia (E)

Compatibilidade entre:

* energia atual do usuário
* energia exigida pela ação

Tabela simples:

| Energia atual | Energia da ação | Fator |
| ------------- | --------------- | ----- |
| Alta          | Alta            | 1.0   |
| Média         | Média           | 1.0   |
| Baixa         | Baixa           | 1.0   |
| Alta          | Média           | 0.9   |
| Média         | Alta            | 0.7   |
| Baixa         | Alta            | 0.3   |

---

## 🧮 Fórmula final do score

```
Score = U × I × A × E
```

A ação com **maior Score** é sugerida como:

> **Next Right Action**

---

## 🧠 Regras de segurança (importantes)

### 🔹 Regra 1 — Tempo disponível

Se:

```
estimated_time > available_time
```

→ ação descartada temporariamente

---

### 🔹 Regra 2 — Saturação

Ações feitas repetidamente:

* sofrem leve penalização
* evitam monotonia

---

### 🔹 Regra 3 — Recuperação

Se energia = muito baixa:

* algoritmo pode sugerir:

  * revisão leve
  * descanso consciente

Isso é **decisão válida**, não falha.

---

## 🧭 Exemplo prático

### Contexto

* Energia: Média
* Tempo disponível: 1h
* Disciplina: Sistemas Digitais (Risk: High)
* Prazo: Prova em 3 dias

### Ação candidata

* Revisar Flip-Flop JK
* Impacto: High
* Alinhamento: Path acadêmico
* Energia requerida: Média

### Score

```
U = 1 / (3 + 1) = 0.25
I = 1.0
A = 1.3
E = 1.0

Score = 0.325
```

Ação escolhida.

---

## 🧠 Importante: Transparência

O KODO **explica a decisão** ao usuário:

> “This action was suggested because it has high impact, an upcoming deadline, and aligns with your academic path.”

Confiança nasce da explicação.

---

## 🔮 Evolução futura (ML-ready)

Esse algoritmo vira:

* baseline confiável
* dataset rotulado automaticamente

ML entra depois para:

* ajustar pesos
* prever impacto real
* personalizar energia

---

## 🧠 Frase-guia do algoritmo

> *“Always choose the action that moves the path forward.”*

---

**KODO — Decide with clarity.**
