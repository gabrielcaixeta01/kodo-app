# KODO — Studies (Wireframe Textual)

## Objetivo da tela

Dar **consciência acadêmica imediata** ao usuário:

> **“Como estão minhas disciplinas e onde devo me preocupar?”**

Sem planejamento excessivo.
Sem microgerenciamento.

---

## 🧭 Estrutura Geral

```
[ Header ]
[ Discipline Overview ]
[ Discipline List ]
[ Discipline Detail (modal / page) ]
```

---

## 🔝 Header

Minimalista, consistente com o Dashboard.

```
Studies
---------------------------------------------
Current semester overview
```

Sem filtros complexos no início.

---

## 📊 Discipline Overview (visão geral)

Resumo rápido do semestre:

```
SEMESTER STATUS
---------------------------------------------
Total disciplines: 6
At risk: 2
Upcoming exams: 3 (next in 4 days)
---------------------------------------------
```

Função:

* criar **consciência**
* não é clicável
* serve de contexto mental

---

## 📚 Discipline List (lista principal)

Cada disciplina é um **card resumido**, não uma linha seca.

```
---------------------------------------------
Sistemas Digitais
Risk: High
Next deadline: Prova 1 (3 days)
Progress: ████░░░░ 45%
---------------------------------------------

---------------------------------------------
Cálculo III
Risk: Medium
Next deadline: Lista 4 (7 days)
Progress: ██████░░ 65%
---------------------------------------------
```

### Regras visuais

* Risk usa cor **suave**, não agressiva
* Progress é visual, não numérico demais
* Ordenação automática:

  * maior risco primeiro

---

## 🎓 Discipline Card — Informações

Cada card mostra apenas:

* Nome
* Nível de risco (Low / Medium / High)
* Próximo evento relevante
* Progresso geral

Nada de:

* notas detalhadas
* cronogramas longos

---

## 🔍 Discipline Detail (ao clicar)

Tela/modal dedicada à disciplina.

```
Sistemas Digitais
---------------------------------------------
Professor: João Silva
Credits: 4
Current risk: High
---------------------------------------------

Upcoming
• Prova 1 — 3 days
• Lista 3 — 6 days

Study sessions (last 7 days)
• 2 sessions — 1h 20m total

Suggested focus
→ Revisar Flip-Flop JK
---------------------------------------------
[ Add Study Session ]
[ View Tasks ]
```

---

## 🧠 Lógica de Risco (conceito)

O usuário **não define o risco manualmente**.

O sistema calcula com base em:

* proximidade de avaliações
* tempo estudado recentemente
* dificuldade da disciplina
* peso da avaliação

Resultado:

* **Low**
* **Medium**
* **High**

Simples, explicável.

---

## 🎯 Princípios de UX da tela Studies

* A disciplina **não vira um projeto**
* Ela é um **contexto**
* A decisão continua sendo do Dashboard

Studies informa.
Dashboard decide.

---

## 🔜 Conexões com outras telas

* Studies → alimenta o **Next Right Action**
* Sessions → ajustam risco automaticamente
* Reflect → analisa padrões por disciplina

---

## 🧠 Frase-guia do design

> *“Mostre o suficiente para gerar clareza, não ansiedade.”*

---

**KODO — Discipline is clarity.**
