"""
Ventana de presentación para segunda pantalla
Optimizada para fluidez y rendimiento
"""
from PyQt5.QtWidgets import QWidget, QVBoxLayout, QLabel
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtGui import QPixmap, QImage
from PIL import Image
import vlc
import os


class DisplayWindow(QWidget):
    """Ventana para mostrar contenido multimedia en pantalla secundaria"""

    def __init__(self):
        super().__init__()
        self.current_media = None
        self.vlc_instance = vlc.Instance('--no-xlib')
        self.vlc_player = self.vlc_instance.media_player_new()

        self.init_ui()

    def init_ui(self):
        """Inicializa la interfaz"""
        self.setWindowTitle('ShowDisplay - Presentation')
        self.setStyleSheet("background-color: black;")

        # Layout principal
        layout = QVBoxLayout()
        layout.setContentsMargins(0, 0, 0, 0)
        self.setLayout(layout)

        # Label para imágenes
        self.image_label = QLabel()
        self.image_label.setAlignment(Qt.AlignCenter)
        self.image_label.setScaledContents(False)
        layout.addWidget(self.image_label)

        # Widget para video
        self.video_widget = QWidget()
        layout.addWidget(self.video_widget)

        # Ocultar ambos inicialmente
        self.image_label.hide()
        self.video_widget.hide()

        # Configurar para pantalla completa
        self.showFullScreen()

    def show_image(self, image_path: str):
        """Muestra una imagen de forma optimizada"""
        try:
            # Detener cualquier video en reproducción
            if self.vlc_player.is_playing():
                self.vlc_player.stop()

            self.video_widget.hide()
            self.image_label.show()

            # Cargar y escalar imagen con Pillow para mejor rendimiento
            pil_image = Image.open(image_path)

            # Convertir a RGB si es necesario
            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')

            # Escalar manteniendo aspecto
            window_size = self.size()
            pil_image.thumbnail((window_size.width(), window_size.height()), Image.Resampling.LANCZOS)

            # Convertir a QPixmap
            image_data = pil_image.tobytes("raw", "RGB")
            qimage = QImage(image_data, pil_image.width, pil_image.height,
                          pil_image.width * 3, QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(qimage)

            self.image_label.setPixmap(pixmap)
            self.current_media = image_path

        except Exception as e:
            print(f"Error loading image: {e}")

    def show_video(self, video_path: str):
        """Reproduce un video de forma fluida"""
        try:
            # Ocultar imagen
            self.image_label.hide()
            self.video_widget.show()

            # Detener video anterior si existe
            if self.vlc_player.is_playing():
                self.vlc_player.stop()

            # Configurar VLC player
            if os.name == 'nt':  # Windows
                self.vlc_player.set_hwnd(int(self.video_widget.winId()))
            else:  # Linux/Mac
                self.vlc_player.set_xwindow(int(self.video_widget.winId()))

            # Cargar y reproducir video
            media = self.vlc_instance.media_new(video_path)
            self.vlc_player.set_media(media)
            self.vlc_player.play()

            self.current_media = video_path

        except Exception as e:
            print(f"Error loading video: {e}")

    def stop_media(self):
        """Detiene la reproducción actual"""
        if self.vlc_player.is_playing():
            self.vlc_player.stop()
        self.image_label.clear()
        self.image_label.hide()
        self.video_widget.hide()
        self.current_media = None

    def pause_media(self):
        """Pausa el video actual"""
        if self.vlc_player.is_playing():
            self.vlc_player.pause()

    def resume_media(self):
        """Resume el video pausado"""
        if not self.vlc_player.is_playing() and self.current_media:
            self.vlc_player.play()

    def closeEvent(self, event):
        """Limpieza al cerrar"""
        self.vlc_player.stop()
        self.vlc_player.release()
        self.vlc_instance.release()
        event.accept()

    def resizeEvent(self, event):
        """Ajustar imagen al cambiar tamaño"""
        super().resizeEvent(event)
        if self.current_media and self.image_label.isVisible():
            # Recargar imagen con nuevo tamaño
            self.show_image(self.current_media)
