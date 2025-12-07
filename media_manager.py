"""
Gestor de archivos multimedia
Maneja la lista de archivos y sus metadatos
"""
import os
from typing import List, Dict
from pathlib import Path


class MediaItem:
    """Representa un archivo multimedia"""

    SUPPORTED_IMAGES = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'}
    SUPPORTED_VIDEOS = {'.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'}

    def __init__(self, file_path: str):
        self.file_path = file_path
        self.name = os.path.basename(file_path)
        self.extension = Path(file_path).suffix.lower()
        self.type = self._determine_type()
        self.duration = None

    def _determine_type(self) -> str:
        """Determina el tipo de archivo multimedia"""
        if self.extension in self.SUPPORTED_IMAGES:
            return 'image'
        elif self.extension in self.SUPPORTED_VIDEOS:
            return 'video'
        return 'unknown'

    def is_valid(self) -> bool:
        """Verifica si el archivo es válido"""
        return self.type != 'unknown' and os.path.exists(self.file_path)


class MediaManager:
    """Gestiona la colección de archivos multimedia"""

    def __init__(self):
        self.media_items: List[MediaItem] = []
        self.current_index = 0

    def add_file(self, file_path: str) -> bool:
        """Agrega un archivo a la lista"""
        media_item = MediaItem(file_path)
        if media_item.is_valid():
            self.media_items.append(media_item)
            return True
        return False

    def add_files(self, file_paths: List[str]) -> int:
        """Agrega múltiples archivos"""
        count = 0
        for file_path in file_paths:
            if self.add_file(file_path):
                count += 1
        return count

    def remove_file(self, index: int) -> bool:
        """Elimina un archivo de la lista"""
        if 0 <= index < len(self.media_items):
            self.media_items.pop(index)
            if self.current_index >= len(self.media_items) and self.current_index > 0:
                self.current_index -= 1
            return True
        return False

    def clear(self):
        """Limpia toda la lista"""
        self.media_items.clear()
        self.current_index = 0

    def get_item(self, index: int) -> MediaItem:
        """Obtiene un item por índice"""
        if 0 <= index < len(self.media_items):
            return self.media_items[index]
        return None

    def get_current_item(self) -> MediaItem:
        """Obtiene el item actual"""
        return self.get_item(self.current_index)

    def set_current_index(self, index: int):
        """Establece el índice actual"""
        if 0 <= index < len(self.media_items):
            self.current_index = index

    def get_count(self) -> int:
        """Retorna la cantidad de items"""
        return len(self.media_items)

    def move_item(self, from_index: int, to_index: int) -> bool:
        """Mueve un item de posición"""
        if 0 <= from_index < len(self.media_items) and 0 <= to_index < len(self.media_items):
            item = self.media_items.pop(from_index)
            self.media_items.insert(to_index, item)
            return True
        return False
