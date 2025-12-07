"""
ShowDisplay - Sistema de presentación multimedia
Punto de entrada principal
"""
import sys
from PyQt5.QtWidgets import QApplication
from main_window import MainWindow


def main():
    """Función principal"""
    app = QApplication(sys.argv)
    app.setApplicationName('ShowDisplay')

    # Crear y mostrar ventana principal
    main_window = MainWindow()
    main_window.show()

    sys.exit(app.exec_())


if __name__ == '__main__':
    main()
