'use client'

import { useState, useEffect, useCallback, useReducer } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Undo, Redo, Save, Plus, Minus, Share } from 'lucide-react'

const ResponsiveGridLayout = WidthProvider(Responsive)

type BentoItem = {
  i: string
  x: number
  y: number
  w: number
  h: number
  title: string
  content: string
}

type Layout = {
  name: string
  items: BentoItem[]
}

const exampleLayouts: Layout[] = [
  {
    name: 'Featured Content',
    items: [
      { i: '1', x: 0, y: 0, w: 6, h: 4, title: 'Main Feature', content: 'Highlight your most important content here.' },
      { i: '2', x: 6, y: 0, w: 6, h: 2, title: 'Secondary Feature', content: 'Add a complementary feature or announcement.' },
      { i: '3', x: 6, y: 2, w: 3, h: 2, title: 'Quick Link 1', content: 'Provide easy access to popular content.' },
      { i: '4', x: 9, y: 2, w: 3, h: 2, title: 'Quick Link 2', content: 'Another quick access point for users.' },
    ]
  },
  {
    name: 'Product Showcase',
    items: [
      { i: '1', x: 0, y: 0, w: 4, h: 4, title: 'Product 1', content: 'Showcase your main product or service.' },
      { i: '2', x: 4, y: 0, w: 4, h: 4, title: 'Product 2', content: 'Highlight another key product or service.' },
      { i: '3', x: 8, y: 0, w: 4, h: 4, title: 'Product 3', content: 'Feature a third important offering.' },
      { i: '4', x: 0, y: 4, w: 12, h: 2, title: 'Call to Action', content: 'Encourage users to explore more or make a purchase.' },
    ]
  },
  {
    name: 'Blog Layout',
    items: [
      { i: '1', x: 0, y: 0, w: 8, h: 3, title: 'Featured Post', content: 'Highlight your latest or most popular blog post.' },
      { i: '2', x: 8, y: 0, w: 4, h: 3, title: 'About', content: 'A brief introduction about your blog or yourself.' },
      { i: '3', x: 0, y: 3, w: 4, h: 3, title: 'Recent Post 1', content: 'Summary of a recent blog post.' },
      { i: '4', x: 4, y: 3, w: 4, h: 3, title: 'Recent Post 2', content: 'Summary of another recent blog post.' },
      { i: '5', x: 8, y: 3, w: 4, h: 3, title: 'Categories', content: 'List of blog categories or tags.' },
    ]
  },
  {
    name: 'Dashboard',
    items: [
      { i: '1', x: 0, y: 0, w: 4, h: 3, title: 'User Stats', content: 'Display key user statistics or metrics.' },
      { i: '2', x: 4, y: 0, w: 4, h: 3, title: 'Recent Activity', content: 'Show recent user activities or notifications.' },
      { i: '3', x: 8, y: 0, w: 4, h: 3, title: 'Quick Actions', content: 'Provide shortcuts to common tasks or actions.' },
      { i: '4', x: 0, y: 3, w: 6, h: 3, title: 'Performance Graph', content: 'Visualize important performance data.' },
      { i: '5', x: 6, y: 3, w: 6, h: 3, title: 'To-Do List', content: 'Display upcoming tasks or deadlines.' },
    ]
  },
]

type HistoryState = {
  past: BentoItem[][]
  present: BentoItem[]
  future: BentoItem[][]
}

type HistoryAction =
  | { type: 'UPDATE'; items: BentoItem[] }
  | { type: 'UNDO' }
  | { type: 'REDO' }

const historyReducer = (state: HistoryState, action: HistoryAction): HistoryState => {
  switch (action.type) {
    case 'UPDATE':
      return {
        past: [...state.past, state.present],
        present: action.items,
        future: []
      }
    case 'UNDO':
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]
      const newPast = state.past.slice(0, state.past.length - 1)
      return {
        past: newPast,
        present: previous,
        future: [state.present, ...state.future]
      }
    case 'REDO':
      if (state.future.length === 0) return state
      const next = state.future[0]
      const newFuture = state.future.slice(1)
      return {
        past: [...state.past, state.present],
        present: next,
        future: newFuture
      }
    default:
      return state
  }
}

const LayoutPreviewCard = ({ layout, onClick, isSelected }: { layout: Layout; onClick: () => void; isSelected: boolean }) => {
  return (
    <button
      onClick={onClick}
      className={`p-4 border rounded-lg transition-all ${
        isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary'
      }`}
      aria-pressed={isSelected}
    >
      <h3 className="text-sm font-semibold mb-2">{layout.name}</h3>
      <div className="grid grid-cols-12 gap-1 h-24 overflow-hidden">
        {layout.items.map((item) => (
          <div
            key={item.i}
            className="bg-secondary"
            style={{
              gridColumn: `span ${item.w} / span ${item.w}`,
              gridRow: `span ${item.h} / span ${item.h}`,
            }}
          ></div>
        ))}
      </div>
    </button>
  )
}

export default function Component() {
  const [columns, setColumns] = useState({ lg: 12, md: 8, sm: 4 })
  const [gap, setGap] = useState(4)
  const [isDense, setIsDense] = useState(true)
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  const [layouts, setLayouts] = useState<Layout[]>(exampleLayouts)
  const [newLayoutName, setNewLayoutName] = useState('')
  const [borderRadius, setBorderRadius] = useState(8)
  const [selectedLayout, setSelectedLayout] = useState(layouts[0].name)

  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: exampleLayouts[0].items,
    future: []
  })

  const updateLayout = useCallback(() => {
    const width = window.innerWidth
    let newBreakpoint = 'lg'
    if (width < 768) newBreakpoint = 'sm'
    else if (width < 1200) newBreakpoint = 'md'

    setCurrentBreakpoint(newBreakpoint)
  }, [])

  useEffect(() => {
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [updateLayout])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          dispatch({ type: 'REDO' })
        } else {
          dispatch({ type: 'UNDO' })
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const addItem = () => {
    const newItem: BentoItem = {
      i: String(history.present.length + 1),
      x: 0,
      y: Infinity,
      w: 3,
      h: 2,
      title: `New Item ${history.present.length + 1}`,
      content: 'Edit this content to describe your new item.',
    }
    dispatch({ type: 'UPDATE', items: [...history.present, newItem] })
  }

  const removeItem = (id: string) => {
    dispatch({ type: 'UPDATE', items: history.present.filter(item => item.i !== id) })
  }

  const onLayoutChange = (layout: any, layouts: any) => {
    const updatedItems = history.present.map(item => {
      const layoutItem = layout.find((l: any) => l.i === item.i)
      return layoutItem ? { ...item, ...layoutItem } : item
    })
    dispatch({ type: 'UPDATE', items: updatedItems })
  }

  const getResponsiveSpan = (w: number) => {
    const mobile = Math.min(w * 2, 4)
    const tablet = Math.min(w * 1.5, 8)
    const desktop = w
    return `col-span-${mobile} md:col-span-${tablet} lg:col-span-${desktop}`
  }

  const exportTailwindCSS = () => {
    const gridClasses = `grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-${gap} ${isDense ? '' : 'grid-flow-row-dense'}`
    
    const itemClasses = history.present.map(item => {
      const colSpan = getResponsiveSpan(item.w)
      const rowSpan = `row-span-${item.h}`
      return `<div class="${colSpan} ${rowSpan} bg-secondary text-secondary-foreground rounded-[${borderRadius}px] p-6">
  <h3 class="text-lg font-semibold">${item.title}</h3>
  <p>${item.content}</p>
</div>`
    }).join('\n  ')

    return `<div class="${gridClasses}">
  ${itemClasses}
</div>`
  }

  const handleLayoutChange = (layoutName: string) => {
    const newLayout = layouts.find(layout => layout.name === layoutName)
    if (newLayout) {
      dispatch({ type: 'UPDATE', items: newLayout.items })
      setSelectedLayout(layoutName)
    }
  }

  const saveCurrentLayout = () => {
    if (newLayoutName.trim() === '') return
    const newLayout: Layout = {
      name: newLayoutName,
      items: history.present
    }
    setLayouts([...layouts, newLayout])
    setNewLayoutName('')
  }

  const getLayouts = () => {
    const baseLayout = history.present.map(item => ({
      ...item,
      w: currentBreakpoint === 'sm' ? Math.min(item.w * 2, 4) :
         currentBreakpoint === 'md' ? Math.min(item.w * 1.5, 8) :
         item.w
    }))
    return {
      lg: baseLayout,
      md: baseLayout,
      sm: baseLayout
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Bento Grid Generator</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
              <Share className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Tailwind CSS Code</DialogTitle>
            </DialogHeader>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code>{exportTailwindCSS()}</code>
            </pre>
          </DialogContent>
        </Dialog>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 bg-background border-r p-4 overflow-y-auto flex flex-col space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-2">Choose a Layout</h2>
            <div className="grid grid-cols-1 gap-4">
              {layouts.map((layout) => (
                <LayoutPreviewCard
                  key={layout.name}
                  layout={layout}
                  onClick={() => handleLayoutChange(layout.name)}
                  isSelected={selectedLayout === layout.name}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Customize Grid</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gap">Gap: {gap}</Label>
                <Slider
                  id="gap"
                  min={0}
                  max={8}
                  step={1}
                  value={[gap]}
                  onValueChange={(value) => setGap(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="border-radius">Border Radius: {borderRadius}px</Label>
                <Slider
                  id="border-radius"
                  min={0}
                  max={24}
                  step={1}
                  value={[borderRadius]}
                  onValueChange={(value) => setBorderRadius(value[0])}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="dense-mode"
                  checked={isDense}
                  onCheckedChange={setIsDense}
                />
                <Label htmlFor="dense-mode">Dense Mode</Label>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Actions</h2>
            <div className="flex flex-col space-y-2">
              <Button onClick={addItem}><Plus className="w-4 h-4 mr-2" /> Add Item</Button>
              <Button onClick={() => dispatch({ type: 'UNDO' })} disabled={history.past.length === 0}>
                <Undo className="w-4 h-4 mr-2" />
                Undo
              </Button>
              <Button onClick={() => dispatch({ type: 'REDO' })} disabled={history.future.length === 0}>
                <Redo className="w-4 h-4 mr-2" />
                Redo
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Save Layout</h2>
            <div className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="Enter layout name"
                value={newLayoutName}
                onChange={(e) => setNewLayoutName(e.target.value)}
              />
              <Button onClick={saveCurrentLayout} disabled={newLayoutName.trim() === ''}>
                <Save className="w-4 h-4 mr-2" />
                Save Layout
              </Button>
            </div>
          </section>
        </aside>
        <main className="flex-1 p-4 overflow-auto">
          <div className="bg-background rounded-lg shadow-md p-4">
            <ResponsiveGridLayout
              className="layout"
              layouts={getLayouts()}
              breakpoints={{ lg: 1200, md: 768, sm: 0 }}
              cols={columns}
              rowHeight={100}
              width={1200}
              compactType={isDense ? 'vertical' : null}
              preventCollision={!isDense}
              margin={[gap * 4, gap * 4]}
              onLayoutChange={onLayoutChange}
              onBreakpointChange={setCurrentBreakpoint}
            >
              {history.present.map((item) => (
                <div key={item.i} className={`${getResponsiveSpan(item.w)} bg-secondary text-secondary-foreground overflow-hidden`} style={{ borderRadius: `${borderRadius}px` }}>
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold cursor-move">{item.title}</h3>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeItem(item.i)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="flex-grow">{item.content}</p>
                    <div className="mt-2 text-sm text-secondary-foreground/70">
                      Size: {item.w}x{item.h}
                    </div>
                  </div>
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>
        </main>
      </div>
    </div>
  )
}