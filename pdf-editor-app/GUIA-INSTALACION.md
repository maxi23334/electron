# Guía de Instalación - PDF Editor Pro

## Introducción

PDF Editor Pro es una aplicación de escritorio completa para trabajar con archivos PDF, similar a iLovePDF. Esta guía te ayudará a instalar y ejecutar la aplicación en tu computadora.

## Requisitos del Sistema

### Sistemas Operativos Compatibles
- Windows 10/11 (64-bit)
- macOS 10.13 o superior
- Linux (Ubuntu 18.04+, Fedora, Debian, etc.)

### Software Necesario
- **Node.js** versión 16.0.0 o superior
- **npm** (incluido con Node.js)
- Conexión a Internet (solo para la instalación inicial)

## Paso 1: Instalar Node.js

### Windows
1. Visita https://nodejs.org/
2. Descarga el instalador LTS (versión recomendada)
3. Ejecuta el instalador y sigue las instrucciones
4. Reinicia tu computadora

### macOS
**Opción 1: Instalador oficial**
1. Visita https://nodejs.org/
2. Descarga el instalador LTS para macOS
3. Ejecuta el instalador

**Opción 2: Homebrew** (si ya lo tienes instalado)
```bash
brew install node
```

### Linux (Ubuntu/Debian)
```bash
# Actualizar repositorios
sudo apt update

# Instalar Node.js y npm
sudo apt install nodejs npm

# Verificar instalación
node --version
npm --version
```

### Linux (Fedora)
```bash
sudo dnf install nodejs npm
```

## Paso 2: Verificar la Instalación de Node.js

Abre una terminal o línea de comandos y ejecuta:

```bash
node --version
npm --version
```

Deberías ver las versiones instaladas (por ejemplo, v18.17.0 y 9.6.7).

## Paso 3: Descargar PDF Editor Pro

Hay varias formas de obtener la aplicación:

### Opción A: Clonar el repositorio (si está en Git)
```bash
git clone <url-del-repositorio>
cd pdf-editor-app
```

### Opción B: Descargar el ZIP
1. Descarga el archivo ZIP con la aplicación
2. Extrae el contenido en una carpeta de tu elección
3. Abre una terminal en esa carpeta

## Paso 4: Instalar Dependencias

En la terminal, dentro de la carpeta `pdf-editor-app`, ejecuta:

```bash
npm install
```

Este proceso puede tardar varios minutos. Descargará todas las dependencias necesarias:
- Electron (el framework de la aplicación)
- pdf-lib (para manipular PDFs)
- electron-builder (para crear instaladores)

**Nota**: Este paso requiere conexión a Internet.

### Solución de Problemas Durante la Instalación

**Error: "comando no encontrado"**
- Asegúrate de que Node.js y npm estén correctamente instalados
- Reinicia tu terminal

**Error: "Permission denied" (Linux/macOS)**
- No uses `sudo` con npm install
- Si es necesario, configura npm para no requerir permisos de root:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.profile
source ~/.profile
```

**Error de red o timeout**
- Verifica tu conexión a Internet
- Intenta nuevamente: `npm install --verbose`
- Si usas un proxy corporativo, configúralo en npm

## Paso 5: Ejecutar la Aplicación

Una vez instaladas las dependencias, ejecuta:

```bash
npm start
```

La aplicación PDF Editor Pro se abrirá automáticamente.

## Paso 6: Crear un Instalador (Opcional)

Si deseas crear un instalador para tu sistema operativo:

### Windows (crea un archivo .exe)
```bash
npm run build-win
```
El instalador se creará en la carpeta `dist/`

### macOS (crea un archivo .dmg)
```bash
npm run build-mac
```
El instalador se creará en la carpeta `dist/`

### Linux (crea .AppImage y .deb)
```bash
npm run build-linux
```
Los instaladores se crearán en la carpeta `dist/`

**Nota**:
- En macOS, puede que necesites permisos adicionales
- En Linux, para crear paquetes .deb puede requerirse `fakeroot` y `dpkg`

## Paso 7: Instalar la Aplicación

Una vez creado el instalador:

### Windows
1. Ve a la carpeta `dist/`
2. Ejecuta el archivo `.exe`
3. Sigue el asistente de instalación
4. La aplicación se instalará y creará un acceso directo en el escritorio

### macOS
1. Ve a la carpeta `dist/`
2. Abre el archivo `.dmg`
3. Arrastra PDF Editor Pro a la carpeta Aplicaciones
4. Ejecuta desde el Launchpad o Aplicaciones

### Linux
**Para .AppImage:**
```bash
cd dist
chmod +x PDF-Editor-Pro-*.AppImage
./PDF-Editor-Pro-*.AppImage
```

**Para .deb:**
```bash
cd dist
sudo dpkg -i pdf-editor-pro_*.deb
```

## Uso de la Aplicación

1. **Abre PDF Editor Pro**
2. **Selecciona una herramienta**:
   - Fusionar PDF: Combina múltiples PDFs
   - Dividir PDF: Separa un PDF en partes
   - Comprimir PDF: Reduce el tamaño del archivo
   - Rotar PDF: Gira las páginas
   - Extraer Páginas: Crea un nuevo PDF con páginas seleccionadas
   - Eliminar Páginas: Quita páginas no deseadas

3. **Carga tus archivos PDF**
4. **Configura las opciones** (si aplica)
5. **Haz clic en "Procesar"**
6. **Guarda el resultado**

## Personalizar el Icono

Para cambiar el icono de la aplicación:

1. Crea o descarga un icono PNG de 512x512 píxeles
2. Reemplaza el archivo `assets/icon.png`
3. Vuelve a crear el instalador con `npm run build-win` (o el comando correspondiente)

## Desinstalar

### Windows
- Panel de Control → Programas → Desinstalar PDF Editor Pro

### macOS
- Arrastra PDF Editor Pro desde Aplicaciones a la Papelera

### Linux
```bash
# Si instalaste con .deb
sudo apt remove pdf-editor-pro

# Si usas .AppImage, simplemente elimina el archivo
rm PDF-Editor-Pro-*.AppImage
```

## Soporte Técnico

### Problemas Comunes

**La aplicación no abre**
- Verifica que Node.js esté instalado correctamente
- Intenta ejecutar `npm start` desde la terminal para ver errores

**Error al procesar PDFs**
- Asegúrate de que el PDF no esté protegido con contraseña
- Verifica que el archivo no esté corrupto

**La aplicación es lenta**
- Los PDFs muy grandes pueden tardar en procesarse
- Cierra otras aplicaciones para liberar memoria

### Obtener Ayuda

- Revisa este documento completo
- Consulta el archivo README.md
- Busca el error específico en Google
- Abre un issue en el repositorio del proyecto

## Actualizaciones

Para actualizar a una nueva versión:

1. Descarga la nueva versión
2. Ejecuta `npm install` nuevamente
3. Recrea el instalador si es necesario

## Licencia

PDF Editor Pro es software de código abierto bajo licencia MIT.

---

**¡Disfruta editando tus PDFs con PDF Editor Pro!**

Desarrollado con ❤️ usando Electron y pdf-lib
