# ShowDisplay

Sistema de presentación multimedia profesional para mostrar imágenes y videos en una segunda pantalla de forma dinámica y fluida.

## 🚀 Stack Tecnológico

- **Frontend**: React 19 + TypeScript
- **UI**: Tailwind CSS
- **Desktop**: Electron
- **Build Tool**: Vite
- **Player**: HTML5 Video

## ✨ Características

- **Interfaz de administración moderna**: Panel de control intuitivo con React
- **Vista previa en tiempo real**: Visualiza tus archivos antes de presentarlos
- **Reproducción fluida**: Optimizado para presentaciones sin interrupciones
- **Soporte multi-pantalla**: Detecta y utiliza automáticamente la segunda pantalla
- **Drag & Drop**: Agrega archivos arrastrándolos (próximamente)
- **Formatos soportados**:
  - 🖼️ Imágenes: JPG, PNG, GIF, BMP, WebP
  - 🎬 Videos: MP4, WebM, OGV (formatos HTML5)

## 📋 Requisitos Previos

- Node.js 16 o superior
- npm 8 o superior

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Lazirrac/showdisplay.git
cd showdisplay
```

2. **Instalar dependencias**
```bash
npm install
```

## 🎮 Uso

### Modo Desarrollo

```bash
npm run dev
```

Esto iniciará:
- Vite dev server en `http://localhost:5173`
- Electron en modo desarrollo

### Compilar para Producción

```bash
npm run build
npm start
```

### Empaquetar Aplicación

```bash
npm run package
```

Esto creará un instalador para tu sistema operativo en la carpeta `dist`.

## 📖 Guía de Uso

### Panel de Control

1. **Agregar Archivos**
   - Click en "Add Files" y selecciona tus archivos multimedia
   - Puedes seleccionar múltiples archivos a la vez

2. **Organizar Archivos**
   - Selecciona un archivo de la lista
   - Usa "Move Up" / "Move Down" para reordenar
   - "Remove" para eliminar archivos individuales
   - "Clear All" para limpiar toda la lista

3. **Vista Previa**
   - Haz click en cualquier archivo para ver la preview en el panel derecho
   - Las imágenes se muestran directamente
   - Los videos muestran un ícono indicador

4. **Presentar en Segunda Pantalla**
   - Click en "Open Display Window" para abrir la ventana de presentación
   - Si tienes segunda pantalla, se abrirá automáticamente en ella
   - Selecciona un archivo y presiona "Show on Display" para mostrarlo
   - "Close Display Window" para cerrar la presentación

### Atajos de Teclado (próximamente)

- `Space`: Pausar/Reanudar video
- `→`: Siguiente archivo
- `←`: Archivo anterior
- `Esc`: Ocultar contenido actual

## 🏗️ Estructura del Proyecto

```
showdisplay/
├── src/
│   ├── main/                 # Proceso principal de Electron
│   │   ├── main.ts          # Punto de entrada de Electron
│   │   └── preload.ts       # Script de preload (IPC)
│   └── renderer/            # Proceso renderer (React)
│       ├── components/      # Componentes de React
│       │   ├── MediaManager.tsx
│       │   ├── PreviewPanel.tsx
│       │   └── ControlPanel.tsx
│       ├── styles/          # Estilos CSS
│       ├── types/           # Definiciones de tipos
│       ├── App.tsx          # Componente principal
│       └── main.tsx         # Punto de entrada de React
├── display.html             # Ventana de presentación
├── index.html               # HTML principal
├── vite.config.ts           # Configuración de Vite
├── tailwind.config.js       # Configuración de Tailwind
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias y scripts
```

## 🔧 Configuración

### Configuración de Electron

El archivo [src/main/main.ts](src/main/main.ts) contiene la configuración principal:
- Detección automática de múltiples pantallas
- Comunicación IPC entre ventanas
- Gestión del ciclo de vida de la aplicación

### Comunicación IPC

Las ventanas se comunican mediante IPC (Inter-Process Communication):
- `open-display-window`: Abre la ventana de presentación
- `close-display-window`: Cierra la ventana de presentación
- `show-media`: Envía un archivo para mostrar
- `stop-media`: Detiene la reproducción actual

## 🎨 Personalización

### Estilos

Los estilos se manejan con Tailwind CSS. Puedes personalizar en:
- [tailwind.config.js](tailwind.config.js) - Configuración de tema
- [src/renderer/styles/index.css](src/renderer/styles/index.css) - Estilos globales

### Componentes

Todos los componentes están en [src/renderer/components/](src/renderer/components/):
- `MediaManager` - Gestión de archivos y lista
- `PreviewPanel` - Vista previa de archivos
- `ControlPanel` - Botones de control

## 🐛 Solución de Problemas

**La aplicación no inicia en modo desarrollo:**
- Verifica que el puerto 5173 esté disponible
- Asegúrate de tener Node.js 16+ instalado

**No se detecta la segunda pantalla:**
- Verifica que la segunda pantalla esté conectada y activa en tu sistema
- Reinicia la aplicación después de conectar la pantalla

**Los videos no se reproducen:**
- Asegúrate de usar formatos compatibles con HTML5 (MP4, WebM)
- Algunos códecs pueden no estar soportados

## 🚧 Próximas Características

- [ ] Drag & Drop para agregar archivos
- [ ] Atajos de teclado
- [ ] Playlist automático con temporizador
- [ ] Transiciones entre medios
- [ ] Soporte para más formatos de video (con FFmpeg)
- [ ] Modo presentación automática
- [ ] Guardado/carga de listas de reproducción
- [ ] Integración con Shadcn UI para componentes avanzados

## 📝 Licencia

MIT License

## 👨‍💻 Desarrollo

Construido con:
- ⚡ Vite para bundling ultra-rápido
- ⚛️ React 19 con TypeScript para type-safety
- 🎨 Tailwind CSS para estilos modernos
- 🖥️ Electron para aplicación desktop multiplataforma

---

**Nota**: Este proyecto está en desarrollo activo. Las características y la API pueden cambiar.
