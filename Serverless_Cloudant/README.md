# Aplicación web y API sin servidor
[![IBM Cloud powered][img-ibmcloud-powered]][url-ibmcloud]

Creará una aplicación web sin servidor alojando contenido de sitio web estático en GitHub Pages e implementando el programa de fondo de la aplicación mediante IBM Cloud™ Functions.

En lugar de suministrar una máquina virtual, un contenedor o un entorno de ejecución de Cloud Foundry para desplegar el programa de fondo, puede implementar la API de programa de fondo con una plataforma sin servidor. Esta puede ser una buena solución para evitar pagar por el tiempo de desocupación y dejar la plataforma se escale cuando sea necesario.

# Functions de IBM Cloud
Plataforma de IBM cloud de programacion poliglota FaaS (Functions-as-a-Service) para desarrollo de codigo ligero que escala dependiendo de la demanda.

Para mayor informacion: [![Functions][img-cloud-functions]][url-ibmcloud-Functions]

## IBM Developer Advocates Team

Módulo: Serverless	
Agenda
* [Prework](#Prework)
* [Crear y configurar Cloudant DB](#Crear-y-configurar-Cloudant-DB)
* [Configuración de Functions](#Configuración-de-Functions)
* [Configuración de API](#Configurar-el-API)
* [Despliegue de Aplicación](#Despliegue)





## Prework:
* Cuenta de [IBM Cloud][url-IBMCLOUD]
* Instalar [CLI de IBM Cloud][url-CLI-IBMCLOUD] 
* Cuenta en [GitHub][url-github-join]
* Utilizar safari, chrome, firefox, edge

### Cupones para Estudiantes y profesores
 

	1.	Acceder al HUB para Software para uso académico. Y navegar hasta la parte de abajo de la pagina https://onthehub.com/ibm/?utm_sourc=ibm-ai-productpage&utm_medium=onthehubproductpage&utm_campaign=IBM 
	2.	Buscar el WebStore del instituto/escuela al que perteneces. 
	3.	En caso de no contar con WebStore, acceder al portal de IBM Academic Initiative y seleccionar la opción de <Students> 
	4.	Seleccionar <Add to Cart> para IBM Bluemix – 6 Month Trial. 
	5.	Realizar el registro correspondiente utilizando la cuenta de correo académica 
 
### Cargar créditos en IBM Cloud
	1.	Ingresamos a nuestro panel de control de IBM Cloud (cloud.ibm.com)
	2.	Una vez que tengamos el código nos vamos a Gestionar>Facturación y Uso>Facturación
	3.	Buscamos “Códigos de características (Promocionales)”


## Crear y configurar Cloudant DB:
1.De nuestro catálogo en cloud.ibm.com buscamos Cloudant.
![](img/imc1.png)
2.Seleccionamos Cloudant.
![](img/imc2.png)
3.Lo nombramos guestbook-db, seleccionamos Legacy Credentials y IAM, posteriormente creamos una instancia del servicio.
![](img/imc3.png)
4.Ya que el servicio este desplegado y listo para usar, en el tab de “Service Credentials” buscarmo si ya tenemos alguna creada, si no es asi, generamos una nueva credencial, que usaremos más adelante.
![](img/imc5.png)
![](img/imc6.png)
5.Volvemos a la tab de "Manage" y le damos click en “Launch cloudant dashboard”.
![](img/imc4.png)
6.Nos vamos a la tab de lado izquierdo, damos click en "Create Database" y la nombramos "guestbook".
 ![](img/imc7.png)

## Configuración de Functions
En esta sección configuraremos nuestro servicio de Functions.
1. Secuencia de acciones para escribir a la base de datos
	1. Vamos al catálogo y buscamos **Cloud Functions**.
	![](img/im1.png)
 	2. Una vez dentro seleccionamos "Actions".
	![](img/im2.png) 
	3. Damos click en "Create".
	![](img/im3.png)
	5. Ponemos el nombre "prepare-entry-for-save" y seleccionamos "Node.js 10" como el Runtime, damos click en "Create".
	![](img/im4.png)
	6. Cambiamos el código por el siguiente:
		``` js
		function main(params) {
		 if (!params.nombre || !params.comentario) {
		  return Promise.reject({ error: 'no nombre or comentario'});
		  }
		 return {
		  doc: {
		   createdAt: new Date(),
		   nombre: params.nombre,
		   correo: params.correo,
		   comentario: params.comentario
		  }
		 };
	 	}
		```
	7. Lo salvamos.
	![](img/im5.png)
	8. Para añadir nuestra acción a una secuencia primero nos vamos al tab “Enclosing Secuences” y damos click en “Add to Sequence”.
	![](img/im6.png)
 	9.	Para el nombre de la secuencia ponemos "save-guestbook-entry-sequence" y posteriormente damos click en "Create and Add".
	![](img/im7.png)
	10.	Una vez que esta creada nuestra secuencia le damos click al nombre de la secuencia "save-guestbook-entry-sequence" y posteriormente damos click en "Add".
	![](img/im8.png)
 	11.	Damos click en "Use Public" y seleccionamos "Cloudant".
	![](img/im9.png)
 	12.	Seleccionamos la acción "create-document", damos click en "New Binding", ponemos de nombre de nuestro paquete "binding-for-guestbook" y en "Instance" seleccionamos "Input Your Own Credentials".
	![](img/im10.png)
 	13.	 Nos desplegara una lista. Para llenar estos datos copiamos las credenciales que tenemos en nuestro servicio de "Cloudant" y damos click en "Add", lo llenamos de la siguiente manera:
	![](img/im11.png)
 	14.	Para probar que esté funcionando, damos click en "save" y luego en "change input" e ingresamos nuestro siguiente JSON y damos click en Apply y luego en Invoke
	 ``` json
		{
		"nombre": "Isaac Carrada",
		"correo": "isaac@carrada.com",
		"comentario": "HOLA MUNDO"
		}
	```
	Una vez hecho esto y nos de una id de activacion correcta, podremos verlo escrito en nuestra base de datos de "Cloudant", en el "Dashboard", en la sección "Documents"
	![](img/im12.png)
	![](img/im13.png)
	![](img/im14.png)
2. Secuencia de acciones para obtener las entradas de la base de datos
Esta secuencia la usaremos para tomar las entradas de cada usuario y sus respectivos comentarios, regresemos a "Functions/Actions".
![](img/im15.png)
	1.	En nuestra tab de functions creamos una nueva acción Node.js y le ponemos el nombre "set-read-input", siguiendo el mismo proceso que en la acción anterior.
	![](img/im16.png)
	![](img/im17.png)
	![](img/im18.png)
	2.	Reemplazamos el código que viene, esta acción pasa los parámetros apropiados a nuestra siguiente acción:
		``` js
		function main(params) {
		 return {
		  params: {
		   include_docs: true
		   }
		 };
		}
		```
	3. Damos click en "Save" y click en "Enclosing Sequences".
	![](img/im19.png)
	4. Damos "Add to Sequence" y "Create New" con el nombre "read-guestbook-entries-sequence", y damos click en "Create and Add".
	![](img/im20.png)
	5. Damos click en el nombre de la secuencia "read-guestbook-entries-sequence".
 	6. Damos click en "Add" para crear una segunda acción en la secuencia.
	7. Seleccionamos "Public" y "Cloudant".
 	8.	Seleccionamos "list-documents" en actions y seleccionamos el binding "binding-for-guestbook" y posteriormente damos click en "Add".
	![](img/im21.png)
 	9.	Damos click en "Save" y luego en "Add" para añadir una acción más a la secuencia, esta es la que va a dar el formato de los documentos cuando regresen de Cloudant.
	10.	La nombraremos "format-entries" y posteriormente damos click en "Create and add"
	![](img/im22.png) 
	11.	Damos click en "Save" y luego en nuestra accion "format-entries" y reemplazamos el código con:
		``` js
		const md5 = require('spark-md5');
			
		function main(params) {
		 return {
		  entries: params.rows.map((row) => { return {
		   nombre: row.doc.nombre,
		   correo: row.doc.correo,
		   comentario: row.doc.comentario,
		   createdAt: row.doc.createdAt,
		   icon: (row.doc.correo ? `https://secure.gravatar.com/avatar/${md5.hash(row.doc.correo.trim().toLowerCase())}?s=64` : null)
		  }})
		 };
		}
		```
	12.	Salvamos y regresamos a nuestra secuencia para correrla con "invoke" (Esto lo podemos hacer dando click en acciones, y luego en nuestra secuencia, o en "Enclosing Sequence" y luego en nuestra secuencia)
	![](img/im23.png)
	![](img/im24.png)
 
## Configurar el API
1.	Dentro de nuestras acciones seleccionamos ambas secuencias y en la tab de "Endpoints" damos click en "Enable Web Action" y damos click en "Save". **Es importante que se haga para cada secuencia**.
![](img/im25.png)
![](img/im26.png)
Y nos quede de la siguiente manera:
![](img/im27.png)
2.	Nos vamos a el tag "APIs" que esta de lado derecho.
3.	Damos click en "Create API"
![](img/im28.png)
4.	En el "API name *" ponemos "guestbook" y en el "Base path for API *" ponemos "/guestbook" y damos click en "create operation"
![](img/im29.png) 
5.	Creamos un path que sea /entries ponemos el verbo a GET y seleccionamos la secuencia read-guestbook-entries-sequence y damos click en Create
 
6.	Realizamos la misma acción pero ahora con un POST y la secuencia save-guestbook-entries-sequence y damos click en Create
7.	Salvamos y exponemos la API
 
## Despliegue
1.	Clonamos este repositorio en alguna carpeta de facil acceso
2.	Modificamos el docs/guestbook.js y reemplazamos el valor de apiUrl con la ruta dada por API Gateway, que obtenemos al dar click en APIs
 
3.	Hacemos push de esto a un nuevo repositorio
4.	En el área de Settings>Github Pages, seleccionamos master branch /docs folder
 
5.	Podemos entrar a nuestra página en el link que aparece

[url-ibmcloud]: https://www.ibm.com/cloud/
[img-cloud-functions]: https://img.shields.io/badge/IBM%20cloud-Functions-red.svg
[url-ibmcloud-Functions]: https://www.ibm.com/cloud/functions
[url-IBMCLOUD]: https://cloud.ibm.com/registration
[url-CLI-IBMCLOUD]: https://cloud.ibm.com/docs/cli/reference/ibmcloud?topic=cloud-cli-install-ibmcloud-cli
[url-github-join]: https://github.com/join
[img-ibmcloud-powered]: https://img.shields.io/badge/IBM%20cloud-powered-blue.svg