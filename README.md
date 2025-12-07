# ShowDisplay

Sistema de presentación multimedia para mostrar imágenes y videos en una segunda pantalla de forma dinámica y fluida.

## Características

- **Interfaz de administración intuitiva**: Gestiona tus archivos multimedia desde la ventana principal
- **Vista previa en tiempo real**: Visualiza tus archivos antes de mostrarlos
- **Reproducción fluida**: Optimizado para presentaciones sin interrupciones
- **Soporte multi-pantalla**: Detecta automáticamente segunda pantalla
- **Formatos soportados**:
  - Imágenes: JPG, PNG, GIF, BMP, WebP
  - Videos: MP4, AVI, MKV, MOV, WMV, FLV, WebM

## Requisitos

- Python 3.8 o superior
- VLC Media Player instalado en el sistema

### Instalación de VLC

**Windows:**
- Descarga e instala desde: https://www.videolan.org/vlc/

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install vlc
```

**macOS:**
```bash
brew install vlc
```

## Instalación

1. Clona o descarga este repositorio

2. Instala las dependencias de Python:
```bash
pip install -r requirements.txt
```

## Uso

1. Ejecuta la aplicación:
```bash
python main.py
```

2. **Agregar archivos**:
   - Click en "Add Files" para seleccionar archivos multimedia
   - Selecciona uno o varios archivos de imagen o video

3. **Vista previa**:
   - Click en cualquier archivo de la lista para ver la vista previa
   - La información del archivo se muestra en el panel derecho

4. **Organizar archivos**:
   - Usa "Move Up" y "Move Down" para cambiar el orden
   - "Remove Selected" para eliminar un archivo
   - "Clear All" para limpiar toda la lista

5. **Presentar en segunda pantalla**:
   - Click en "Open Display Window" para abrir la ventana de presentación
   - Si tienes segunda pantalla, se abrirá automáticamente allí
   - Click en "Show on Display" para mostrar el archivo seleccionado
   - "Close Display Window" para cerrar la ventana de presentación

## Estructura del Proyecto

```
showdisplay/
├── main.py              # Punto de entrada
├── main_window.py       # Ventana principal de administración
├── display_window.py    # Ventana de presentación
├── media_manager.py     # Gestor de archivos multimedia
├── requirements.txt     # Dependencias
└── README.md           # Este archivo
```

## Características Técnicas

- **PyQt5**: Framework de interfaz gráfica moderna y responsive
- **VLC**: Reproducción de video de alta calidad con aceleración hardware
- **Pillow**: Procesamiento eficiente de imágenes
- **Arquitectura modular**: Fácil de extender y mantener

## Controles de Teclado (próximamente)

- `Espacio`: Pausar/Reanudar video
- `→`: Siguiente archivo
- `←`: Archivo anterior
- `Esc`: Cerrar pantalla completa

## Solución de Problemas

**Error al reproducir videos:**
- Asegúrate de tener VLC Media Player instalado
- Verifica que el archivo de video no esté corrupto

**No se detecta segunda pantalla:**
- Verifica que la segunda pantalla esté conectada y activa
- Puedes mover manualmente la ventana de presentación

**Rendimiento lento:**
- Reduce la resolución de las imágenes muy grandes
- Asegúrate de tener drivers de video actualizados

## Próximas Características

- [ ] Controles de teclado
- [ ] Playlist automático
- [ ] Transiciones entre medios
- [ ] Temporizador para imágenes
- [ ] Soporte para presentaciones PowerPoint
- [ ] Modo de presentación automática

## Licencia

MIT License

## Autor

Desarrollado para presentaciones multimedia profesionales
