# PDF Editor Pro

Una aplicación de escritorio profesional para editar y manipular archivos PDF, similar a iLovePDF.

## Características

- **Fusionar PDF**: Combina múltiples archivos PDF en uno solo
- **Dividir PDF**: Divide un PDF en múltiples archivos
- **Comprimir PDF**: Reduce el tamaño de tus archivos PDF
- **Rotar PDF**: Rota todas las páginas de tu PDF
- **Extraer Páginas**: Extrae páginas específicas de un PDF
- **Eliminar Páginas**: Elimina páginas no deseadas de tus PDFs

## Instalación

### Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de Instalación

1. **Navega al directorio de la aplicación**:
   ```bash
   cd pdf-editor-app
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecuta la aplicación en modo desarrollo**:
   ```bash
   npm start
   ```

## Crear Instalador

Para crear un instalador para tu sistema operativo:

### Windows
```bash
npm run build-win
```
Esto creará un instalador `.exe` en la carpeta `dist/`

### macOS
```bash
npm run build-mac
```
Esto creará un archivo `.dmg` en la carpeta `dist/`

### Linux
```bash
npm run build-linux
```
Esto creará archivos `.AppImage` y `.deb` en la carpeta `dist/`

## Uso

1. **Abre la aplicación** PDF Editor Pro
2. **Selecciona una herramienta** de la pantalla principal (Fusionar, Dividir, Comprimir, etc.)
3. **Selecciona tus archivos PDF** haciendo clic en "Seleccionar Archivos"
4. **Configura las opciones** según la herramienta seleccionada (por ejemplo, rango de páginas)
5. **Haz clic en "Procesar"** para aplicar la operación
6. **Guarda el resultado** en la ubicación deseada

## Tecnologías Utilizadas

- **Electron**: Framework para aplicaciones de escritorio
- **PDF-lib**: Biblioteca para manipulación de PDFs
- **HTML/CSS/JavaScript**: Interfaz de usuario moderna y responsiva

## Estructura del Proyecto

```
pdf-editor-app/
├── main.js           # Proceso principal de Electron
├── preload.js        # Script de precarga para seguridad
├── index.html        # Interfaz de usuario
├── renderer.js       # Lógica de la aplicación
├── styles.css        # Estilos de la aplicación
├── package.json      # Dependencias y configuración
├── assets/           # Recursos (iconos, imágenes)
└── README.md         # Este archivo
```

## Características de Seguridad

- Context Isolation habilitado
- Node Integration deshabilitado
- Comunicación segura entre procesos mediante IPC

## Licencia

MIT License - Libre para uso personal y comercial

## Soporte

Para reportar problemas o solicitar nuevas características, por favor abre un issue en el repositorio del proyecto.

---

**¡Disfruta trabajando con tus PDFs!**
