"""
Ventana principal con menú de administración y vista previa
"""
from PyQt5.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
                             QPushButton, QListWidget, QLabel, QFileDialog,
                             QSplitter, QMessageBox, QListWidgetItem, QApplication)
from PyQt5.QtCore import Qt, QSize
from PyQt5.QtGui import QPixmap, QImage, QIcon
from media_manager import MediaManager, MediaItem
from display_window import DisplayWindow
from PIL import Image
import os


class MainWindow(QMainWindow):
    """Ventana principal de administración"""

    def __init__(self):
        super().__init__()
        self.media_manager = MediaManager()
        self.display_window = None
        self.preview_current_item = None

        self.init_ui()

    def init_ui(self):
        """Inicializa la interfaz de usuario"""
        self.setWindowTitle('ShowDisplay - Control Panel')
        self.setGeometry(100, 100, 1200, 700)

        # Widget central
        central_widget = QWidget()
        self.setCentralWidget(central_widget)

        # Layout principal
        main_layout = QVBoxLayout()
        central_widget.setLayout(main_layout)

        # Título
        title_label = QLabel('ShowDisplay - Media Manager')
        title_label.setStyleSheet("font-size: 20px; font-weight: bold; padding: 10px;")
        main_layout.addWidget(title_label)

        # Splitter para dividir lista y preview
        splitter = QSplitter(Qt.Horizontal)
        main_layout.addWidget(splitter)

        # Panel izquierdo - Lista y controles
        left_panel = self.create_left_panel()
        splitter.addWidget(left_panel)

        # Panel derecho - Vista previa
        right_panel = self.create_right_panel()
        splitter.addWidget(right_panel)

        # Configurar proporción del splitter
        splitter.setStretchFactor(0, 2)
        splitter.setStretchFactor(1, 3)

        # Barra de estado
        self.statusBar().showMessage('Ready')

    def create_left_panel(self) -> QWidget:
        """Crea el panel izquierdo con lista y botones"""
        panel = QWidget()
        layout = QVBoxLayout()
        panel.setLayout(layout)

        # Botones de archivo
        file_buttons_layout = QHBoxLayout()

        btn_add_files = QPushButton('Add Files')
        btn_add_files.clicked.connect(self.add_files)
        file_buttons_layout.addWidget(btn_add_files)

        btn_remove = QPushButton('Remove Selected')
        btn_remove.clicked.connect(self.remove_selected)
        file_buttons_layout.addWidget(btn_remove)

        btn_clear = QPushButton('Clear All')
        btn_clear.clicked.connect(self.clear_all)
        file_buttons_layout.addWidget(btn_clear)

        layout.addLayout(file_buttons_layout)

        # Lista de archivos
        self.media_list = QListWidget()
        self.media_list.currentRowChanged.connect(self.on_selection_changed)
        layout.addWidget(self.media_list)

        # Botones de control de orden
        order_layout = QHBoxLayout()

        btn_move_up = QPushButton('Move Up')
        btn_move_up.clicked.connect(self.move_up)
        order_layout.addWidget(btn_move_up)

        btn_move_down = QPushButton('Move Down')
        btn_move_down.clicked.connect(self.move_down)
        order_layout.addWidget(btn_move_down)

        layout.addLayout(order_layout)

        # Botones de presentación
        presentation_layout = QVBoxLayout()

        btn_show_display = QPushButton('Show on Display')
        btn_show_display.setStyleSheet("background-color: #4CAF50; color: white; font-weight: bold; padding: 10px;")
        btn_show_display.clicked.connect(self.show_on_display)
        presentation_layout.addWidget(btn_show_display)

        btn_open_display = QPushButton('Open Display Window')
        btn_open_display.clicked.connect(self.open_display_window)
        presentation_layout.addWidget(btn_open_display)

        btn_close_display = QPushButton('Close Display Window')
        btn_close_display.clicked.connect(self.close_display_window)
        presentation_layout.addWidget(btn_close_display)

        layout.addLayout(presentation_layout)

        # Info label
        self.info_label = QLabel('No files loaded')
        self.info_label.setStyleSheet("padding: 5px; background-color: #f0f0f0;")
        layout.addWidget(self.info_label)

        return panel

    def create_right_panel(self) -> QWidget:
        """Crea el panel derecho con vista previa"""
        panel = QWidget()
        layout = QVBoxLayout()
        panel.setLayout(layout)

        # Título del preview
        preview_title = QLabel('Preview')
        preview_title.setStyleSheet("font-size: 16px; font-weight: bold; padding: 5px;")
        layout.addWidget(preview_title)

        # Label para preview
        self.preview_label = QLabel('No preview available')
        self.preview_label.setAlignment(Qt.AlignCenter)
        self.preview_label.setStyleSheet("background-color: #2b2b2b; color: white; border: 2px solid #555;")
        self.preview_label.setMinimumSize(400, 300)
        self.preview_label.setScaledContents(False)
        layout.addWidget(self.preview_label)

        # Info del archivo
        self.file_info_label = QLabel('')
        self.file_info_label.setStyleSheet("padding: 10px; background-color: #f9f9f9;")
        layout.addWidget(self.file_info_label)

        return panel

    def add_files(self):
        """Abre diálogo para agregar archivos"""
        file_filter = "Media Files (*.jpg *.jpeg *.png *.gif *.bmp *.webp *.mp4 *.avi *.mkv *.mov *.wmv *.flv *.webm);;All Files (*.*)"
        files, _ = QFileDialog.getOpenFileNames(self, "Select Media Files", "", file_filter)

        if files:
            count = self.media_manager.add_files(files)
            self.refresh_media_list()
            self.statusBar().showMessage(f'{count} file(s) added')

    def remove_selected(self):
        """Elimina el archivo seleccionado"""
        current_row = self.media_list.currentRow()
        if current_row >= 0:
            item = self.media_manager.get_item(current_row)
            if item:
                self.media_manager.remove_file(current_row)
                self.refresh_media_list()
                self.statusBar().showMessage(f'Removed: {item.name}')

    def clear_all(self):
        """Limpia todos los archivos"""
        reply = QMessageBox.question(self, 'Clear All',
                                     'Are you sure you want to remove all files?',
                                     QMessageBox.Yes | QMessageBox.No)
        if reply == QMessageBox.Yes:
            self.media_manager.clear()
            self.refresh_media_list()
            self.preview_label.clear()
            self.preview_label.setText('No preview available')
            self.file_info_label.clear()
            self.statusBar().showMessage('All files removed')

    def move_up(self):
        """Mueve el item seleccionado hacia arriba"""
        current_row = self.media_list.currentRow()
        if current_row > 0:
            self.media_manager.move_item(current_row, current_row - 1)
            self.refresh_media_list()
            self.media_list.setCurrentRow(current_row - 1)

    def move_down(self):
        """Mueve el item seleccionado hacia abajo"""
        current_row = self.media_list.currentRow()
        if current_row >= 0 and current_row < self.media_manager.get_count() - 1:
            self.media_manager.move_item(current_row, current_row + 1)
            self.refresh_media_list()
            self.media_list.setCurrentRow(current_row + 1)

    def refresh_media_list(self):
        """Refresca la lista de medios"""
        self.media_list.clear()
        for item in self.media_manager.media_items:
            type_icon = '🖼️' if item.type == 'image' else '🎬'
            list_item = QListWidgetItem(f'{type_icon} {item.name}')
            self.media_list.addItem(list_item)

        count = self.media_manager.get_count()
        self.info_label.setText(f'Total files: {count}')

    def on_selection_changed(self, current_row: int):
        """Actualiza la vista previa cuando cambia la selección"""
        if current_row >= 0:
            media_item = self.media_manager.get_item(current_row)
            if media_item:
                self.show_preview(media_item)

    def show_preview(self, media_item: MediaItem):
        """Muestra vista previa del archivo"""
        self.preview_current_item = media_item

        # Actualizar info del archivo
        file_size = os.path.getsize(media_item.file_path) / (1024 * 1024)
        info_text = f'<b>Name:</b> {media_item.name}<br>'
        info_text += f'<b>Type:</b> {media_item.type.upper()}<br>'
        info_text += f'<b>Size:</b> {file_size:.2f} MB<br>'
        info_text += f'<b>Path:</b> {media_item.file_path}'
        self.file_info_label.setText(info_text)

        if media_item.type == 'image':
            self.show_image_preview(media_item.file_path)
        elif media_item.type == 'video':
            self.show_video_preview(media_item.file_path)

    def show_image_preview(self, image_path: str):
        """Muestra preview de imagen"""
        try:
            pil_image = Image.open(image_path)

            if pil_image.mode != 'RGB':
                pil_image = pil_image.convert('RGB')

            # Escalar para preview
            pil_image.thumbnail((600, 400), Image.Resampling.LANCZOS)

            # Convertir a QPixmap
            image_data = pil_image.tobytes("raw", "RGB")
            qimage = QImage(image_data, pil_image.width, pil_image.height,
                          pil_image.width * 3, QImage.Format_RGB888)
            pixmap = QPixmap.fromImage(qimage)

            self.preview_label.setPixmap(pixmap)

        except Exception as e:
            self.preview_label.setText(f'Error loading preview: {str(e)}')

    def show_video_preview(self, video_path: str):
        """Muestra preview de video (thumbnail)"""
        self.preview_label.setText(f'🎬 Video File\n\nClick "Show on Display" to play')

    def open_display_window(self):
        """Abre la ventana de presentación"""
        if not self.display_window:
            self.display_window = DisplayWindow()

            # Mover a segunda pantalla si existe
            screens = QApplication.screens()
            if len(screens) > 1:
                second_screen = screens[1].geometry()
                self.display_window.move(second_screen.x(), second_screen.y())
                self.display_window.showFullScreen()
            else:
                self.display_window.show()

            self.statusBar().showMessage('Display window opened')
        else:
            self.display_window.show()
            self.statusBar().showMessage('Display window already open')

    def close_display_window(self):
        """Cierra la ventana de presentación"""
        if self.display_window:
            self.display_window.close()
            self.display_window = None
            self.statusBar().showMessage('Display window closed')

    def show_on_display(self):
        """Muestra el archivo seleccionado en la ventana de presentación"""
        current_row = self.media_list.currentRow()
        if current_row < 0:
            QMessageBox.warning(self, 'No Selection', 'Please select a file to display')
            return

        if not self.display_window:
            self.open_display_window()

        media_item = self.media_manager.get_item(current_row)
        if media_item:
            if media_item.type == 'image':
                self.display_window.show_image(media_item.file_path)
            elif media_item.type == 'video':
                self.display_window.show_video(media_item.file_path)

            self.statusBar().showMessage(f'Showing: {media_item.name}')

    def closeEvent(self, event):
        """Limpieza al cerrar"""
        if self.display_window:
            self.display_window.close()
        event.accept()
