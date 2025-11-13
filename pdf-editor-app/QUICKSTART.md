# Quick Start - PDF Editor Pro

## Para Desarrolladores

### Instalación Rápida

```bash
# Clonar/descargar y entrar al directorio
cd pdf-editor-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start
```

### Crear Instalador

```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

Los instaladores se generarán en la carpeta `dist/`.

## Estructura del Proyecto

```
pdf-editor-app/
├── main.js           - Proceso principal de Electron
├── preload.js        - Script de precarga (IPC bridge)
├── renderer.js       - Lógica de la UI y manipulación de PDFs
├── index.html        - Interfaz de usuario
├── styles.css        - Estilos
├── package.json      - Dependencias y configuración
├── create-icon.js    - Script para crear icono placeholder
└── assets/
    ├── icon.png      - Icono de la aplicación
    └── icon.svg      - Icono en formato SVG
```

## Dependencias Principales

- **electron**: ^28.0.0 - Framework de aplicación
- **pdf-lib**: ^1.17.1 - Manipulación de PDFs
- **electron-builder**: ^24.9.1 - Generación de instaladores

## Características Implementadas

- ✅ Fusionar múltiples PDFs
- ✅ Dividir PDFs por páginas o rangos
- ✅ Comprimir PDFs
- ✅ Rotar páginas
- ✅ Extraer páginas específicas
- ✅ Eliminar páginas

## Personalización

### Cambiar el Nombre de la Aplicación

Edita `package.json`:
```json
{
  "name": "tu-nombre-app",
  "productName": "Tu Nombre de Aplicación"
}
```

### Cambiar el Icono

Reemplaza `assets/icon.png` con tu icono (512x512 px recomendado).

### Modificar Estilos

Edita `styles.css` para cambiar colores, fuentes, etc.

## Comandos Útiles

```bash
# Desarrollo
npm start                    # Inicia la app en modo desarrollo

# Build
npm run build                # Build para el SO actual
npm run build-win            # Build para Windows
npm run build-mac            # Build para macOS
npm run build-linux          # Build para Linux

# Icono
node create-icon.js          # Crea icono placeholder si no existe
```

## Solución Rápida de Problemas

**No se instalan las dependencias:**
```bash
npm cache clean --force
npm install --legacy-peer-deps
```

**Error al ejecutar:**
```bash
# Verifica versión de Node.js (debe ser >= 16)
node --version

# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

**El build falla:**
```bash
# Asegúrate de que el icono existe
node create-icon.js

# Limpia y reconstruye
npm run prebuild
npm run build
```

## Tecnologías Utilizadas

- **Electron** - Framework para apps de escritorio multiplataforma
- **pdf-lib** - Librería JavaScript para crear y modificar PDFs
- **HTML/CSS/JS** - Interfaz de usuario moderna
- **Node.js** - Runtime de JavaScript

## API de IPC (Comunicación entre procesos)

### Desde Renderer (renderer.js)
```javascript
// Seleccionar archivos
const files = await window.electronAPI.selectPdfFiles();

// Leer PDF
const bytes = await window.electronAPI.readPdfFile(filePath);

// Guardar PDF
await window.electronAPI.savePdfFile(pdfBytes, 'nombre.pdf');

// Mostrar mensaje
await window.electronAPI.showMessage({ type: 'info', title: 'Título', message: 'Mensaje' });
```

## Siguientes Pasos

1. **Prueba la aplicación**: `npm start`
2. **Personaliza**: Cambia estilos, colores, nombre
3. **Añade características**: Implementa nuevas funcionalidades
4. **Crea instalador**: `npm run build-{platform}`
5. **Distribuye**: Comparte el instalador

## Recursos

- [Documentación de Electron](https://www.electronjs.org/docs)
- [Documentación de pdf-lib](https://pdf-lib.js.org/)
- [Electron Builder](https://www.electron.build/)

## Licencia

MIT - Libre para uso personal y comercial

---

**¿Necesitas más detalles?** Consulta `GUIA-INSTALACION.md` o `README.md`
