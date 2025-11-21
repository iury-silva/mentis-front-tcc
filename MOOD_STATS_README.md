# 📊 Sistema de Estatísticas de Humor

Sistema completo de visualização e análise de dados de humor, integrado com os novos endpoints do backend.

## 🎯 Arquitetura

### **Estrutura de Arquivos**

```
src/
├── types/
│   └── mood-stats.types.ts          # Tipos TypeScript para estatísticas
├── services/
│   └── mood-stats.service.ts        # Service com lógica de API e formatação
├── components/
│   └── MoodStats/
│       ├── index.ts                 # Exports centralizados
│       ├── MoodStatsCards.tsx       # Cards de resumo (total, streak, médias)
│       ├── MoodAveragesRadarChart.tsx    # Gráfico radar para médias
│       ├── PeriodComparisonChart.tsx     # Comparação de períodos (barras)
│       ├── MoodTimelineChart.tsx    # Evolução temporal (linhas)
│       ├── MoodHeatmap.tsx          # Mapa de calor por dia da semana
│       └── PeriodSelector.tsx       # Seletor de período (semana/mês/ano)
└── pages/
    └── MoodTracker/
        ├── index.tsx                # Tab principal (Novo/Histórico/Estatísticas)
        └── MoodStatsPage.tsx        # Página de estatísticas completa
```

---

## 🔌 Endpoints Integrados

### **1. GET /mood-record/stats**

- **Descrição**: Visão geral das estatísticas do usuário
- **Retorna**:
  - `totalRecords`: Total de registros
  - `averages`: Médias de todas as métricas
  - `trends`: Tendências (diferença primeiro vs último)
  - `streaks`: Sequência de dias consecutivos
  - `lastRecord`: Último registro salvo

### **2. GET /mood-record/compare-periods?period={week|month|year}**

- **Descrição**: Compara período atual com anterior
- **Parâmetros**: `period` (week, month, year)
- **Retorna**: Dados de ambos os períodos com contagem e médias

### **3. GET /mood-record/range?startDate=...&endDate=...**

- **Descrição**: Busca registros por intervalo de datas
- **Parâmetros**: `startDate`, `endDate` (ISO strings)
- **Retorna**: Array de registros com todos os scores

---

## 🎨 Componentes

### **MoodStatsCards**

Cards de resumo com métricas principais:

- Total de registros
- Streak (dias consecutivos com 🔥)
- Média de cada métrica (humor, ansiedade, energia, sono, estresse)
- Tendência vs início (↑ ↓ -)
- Emojis dinâmicos baseados no score

**Uso:**

```tsx
<MoodStatsCards stats={statsData} />
```

---

### **MoodAveragesRadarChart**

Gráfico radar (spider) mostrando as 5 métricas em um único visual.

**Features:**

- Visualização 360° das médias
- Escala 0-5 automática
- Hover com valores formatados

**Uso:**

```tsx
<MoodAveragesRadarChart
  averages={statsData.averages}
  title="Visão Geral"
  description="Suas métricas em resumo"
/>
```

---

### **PeriodComparisonChart**

Gráfico de barras comparando período atual vs anterior.

**Features:**

- Barras lado a lado (atual vs anterior)
- Badge com % de mudança geral
- Ícones de tendência (↑ ↓ -)
- Informações de período e contagem

**Uso:**

```tsx
<PeriodComparisonChart comparison={comparisonData} />
```

---

### **MoodTimelineChart**

Gráfico de linhas mostrando evolução temporal.

**Features:**

- Múltiplas métricas no mesmo gráfico
- Cores diferenciadas por métrica
- Filtro de métricas selecionadas
- Tooltip com data e valores

**Uso:**

```tsx
<MoodTimelineChart
  records={timelineData}
  selectedMetrics={["score_mood", "score_energy"]}
  title="Últimos 30 Dias"
/>
```

---

### **MoodHeatmap** ⭐ (Criativo!)

Mapa de calor estilo GitHub, mostrando padrões por dia da semana.

**Features:**

- Grid de semanas x dias da semana
- Cores baseadas no score (vermelho → verde)
- Hover com detalhes (data, score, quantidade)
- Legenda de cores
- Ideal para identificar padrões semanais

**Uso:**

```tsx
<MoodHeatmap
  records={timelineData}
  metric="score_mood"
  title="Mapa de Calor - Humor"
/>
```

---

### **PeriodSelector**

Seletor de período para comparações.

**Features:**

- Botões Semana / Mês / Ano
- Ativo com variant "default"
- Ícone de calendário

**Uso:**

```tsx
<PeriodSelector
  selectedPeriod={selectedPeriod}
  onPeriodChange={setSelectedPeriod}
/>
```

---

## 📱 Página Principal: MoodStatsPage

Interface completa com **3 tabs**:

### **Tab 1: Visão Geral**

- MoodAveragesRadarChart (gráfico radar)

### **Tab 2: Comparação**

- PeriodSelector (semana/mês/ano)
- PeriodComparisonChart (barras)

### **Tab 3: Linha do Tempo**

- MoodHeatmap (mapa de calor)
- MoodTimelineChart (todas as métricas)
- MoodTimelineChart (humor + energia)

**Features:**

- Loading states com Loader2
- Error handling com Alert
- Empty states com mensagens amigáveis
- TanStack Query para cache e refetch
- Tabs sticky no topo

---

## 🛠️ Service: moodStatsService

### **Métodos de API**

```typescript
getStatsOverview(); // GET /stats
comparePeriods(period); // GET /compare-periods?period=...
getByDateRange({ startDate, endDate }); // GET /range?startDate=...&endDate=...
```

### **Funções Auxiliares**

```typescript
formatNumber(value, decimals); // Formata com pt-BR
formatTrend(value); // +1.2 ou -0.5
getEmojiByScore(score); // 😢 😟 😐 🙂 😊
getColorByScore(score); // text-red-600, text-green-600...
getMetricLabel(metric); // "score_mood" → "Humor"
getChartColor(metric); // "#8b5cf6" para gráficos
calculatePercentageChange(); // Calcula % entre dois valores
```

---

## 🎯 Integração React Query

Todas as queries utilizam TanStack Query v5:

```typescript
// Estatísticas gerais
const { data: statsData } = useQuery({
  queryKey: ["mood-stats"],
  queryFn: () => moodStatsService.getStatsOverview(),
});

// Comparação de períodos
const { data: comparisonData } = useQuery({
  queryKey: ["mood-comparison", selectedPeriod],
  queryFn: () => moodStatsService.comparePeriods(selectedPeriod),
});

// Timeline (últimos 30 dias)
const { data: timelineData } = useQuery({
  queryKey: ["mood-timeline"],
  queryFn: () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    return moodStatsService.getByDateRange({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  },
});
```

**Benefícios:**

- ✅ Cache automático
- ✅ Refetch on focus
- ✅ Loading states
- ✅ Error handling
- ✅ Invalidação automática

---

## 🎨 Design System

### **Cores das Métricas**

```typescript
Humor:     #8b5cf6 (purple)
Ansiedade: #f59e0b (amber)
Energia:   #10b981 (green)
Sono:      #3b82f6 (blue)
Estresse:  #ef4444 (red)
```

### **Scores → Emojis**

```
5.0 - 4.5: 😊
4.4 - 3.5: 🙂
3.4 - 2.5: 😐
2.4 - 1.5: 😟
1.4 - 1.0: 😢
```

### **Heatmap Colors**

```
4.5+: bg-green-600
3.5+: bg-green-400
2.5+: bg-yellow-400
1.5+: bg-orange-400
<1.5: bg-red-400
```

---

## 🚀 Como Usar

### **1. Navegue para a aba Estatísticas**

No MoodTracker, clique na tab "Estatísticas" (ícone BarChart3)

### **2. Visualize os Cards**

Veja resumo com total, streak e médias

### **3. Explore as Tabs**

- **Visão Geral**: Radar chart
- **Comparação**: Escolha período e compare
- **Linha do Tempo**: Heatmap + gráficos de linha

---

## 💡 Dicas de Extensão

### **Adicionar Filtro de Métricas no Heatmap**

```tsx
const [selectedMetric, setSelectedMetric] = useState<MetricType>("score_mood");

<Select value={selectedMetric} onValueChange={setSelectedMetric}>
  <SelectItem value="score_mood">Humor</SelectItem>
  <SelectItem value="score_energy">Energia</SelectItem>
  ...
</Select>

<MoodHeatmap records={data} metric={selectedMetric} />
```

### **Adicionar Date Range Picker**

Use shadcn Date Range Picker para permitir usuário escolher datas customizadas.

### **Exportar Relatórios**

Adicione botão para gerar PDF com jsPDF ou CSV com papa-parse.

---

## 🧪 Testing

### **Teste com Dados Mock**

```typescript
const mockStats: MoodStatsOverview = {
  totalRecords: 15,
  averages: {
    score_mood: 3.8,
    score_anxiety: 2.5,
    score_energy: 4.2,
    score_sleep: 3.5,
    score_stress: 2.8,
  },
  trends: {
    score_mood: 0.5,
    score_anxiety: -0.3,
    score_energy: 0.8,
    score_sleep: 0.2,
    score_stress: -0.5,
  },
  lastRecord: { ... },
  streaks: 7,
};

<MoodStatsCards stats={mockStats} />
```

---

## 📦 Dependências

- ✅ **recharts**: Gráficos (já instalado)
- ✅ **@tanstack/react-query**: State management assíncrono
- ✅ **lucide-react**: Ícones
- ✅ **shadcn/ui**: Componentes base (Card, Badge, Alert, etc.)

---

## ✨ Destaques Criativos

1. **MoodHeatmap**: Mapa de calor estilo GitHub - único e visual!
2. **Radar Chart**: 360° view das métricas - moderno
3. **Streak com 🔥**: Gamificação - engaja usuário
4. **Tendências com ↑↓**: Visual claro de progresso
5. **Cores por métrica**: Consistência em todos os gráficos
6. **Empty states amigáveis**: UX polido
7. **Loading states suaves**: Feedback visual constante
8. **Responsive design**: 3 colunas → 1 coluna em mobile
9. **Hover tooltips**: Detalhes on-demand
10. **Tabs sticky**: Navegação sempre acessível

---

## 🎯 Próximos Passos

- [ ] Adicionar filtros avançados (por métrica, intervalo custom)
- [ ] Implementar exportação de relatórios (PDF/CSV)
- [ ] Criar insights com IA (análise de padrões)
- [ ] Adicionar comparação com média da comunidade
- [ ] Implementar metas e objetivos
- [ ] Notificações de conquistas (badges)

---

**Desenvolvido com 💜 para Mentis**
