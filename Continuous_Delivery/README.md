# IBM Recipe-Continuous Delivery
Despliega una app en Continuous Delivery utilizando DevOps con Kubernetes y Helm
![](assets/a1.png)<br/>
## Prework:
* Cuenta de [IBM Cloud][url-IBMCLOUD]
* Instalar [CLI de IBM Cloud][url-CLI-IBMCLOUD] 
* Cuenta en [GitHub][url-github-join]
* Instalar [CLI de GitHub][url-github-cli] o instalar [GitHub Desktop][url-githubdesktop]
* [NodeJS][url-node]
* Utilizar safari, chrome, firefox, edge

**Si eres estudiante o profesor, puedes obtener creditos por si quieres usar servicios que estan fuera de la versión lite. Lo puedes hacer de la siguiente manera. (Solo es necesario hacerlo una vez)**
### Cupones para Estudiantes y profesores

* Acceder al HUB para Software para uso académico. Y navegar hasta la parte de abajo de la pagina https://onthehub.com/ibm/?utm_sourc=ibm-ai-productpage&utm_medium=onthehubproductpage&utm_campaign=IBM
* Buscar el WebStore del instituto/escuela al que perteneces.
* En caso de no contar con WebStore, acceder al portal de IBM Academic Initiative y seleccionar la opción de Seleccionar para IBM Bluemix – 6 Month Trial.
* Realizar el registro correspondiente utilizando la cuenta de correo académica

**Si tienes algun cupon para creditos de IBM Cloud, lo puedes cargar de la siguiente manera.**
### Cargar créditos en IBM Cloud

* En la parte superior derecha, buscaremos la parte de "MANAGE"/"GESTIONAR", nos desplegara una lista y seleccionaremos "Account"/"Cuenta".
* De lado izquierdo, tendremos una opción "Account settings"/"Configuracion de cuenta".
* Bajamos un poco hasta encontrar "Subscription and feature codes"/"Codigos de suscripción y carateristicas".
* Da click en "Apply code"/"Aplicar codigo".
* Ingresamos el codigo y click en "Apply"/"Aplicar".

[url-IBMCLOUD]: https://cloud.ibm.com/registration
[url-CLI-IBMCLOUD]: https://cloud.ibm.com/docs/cli/reference/ibmcloud?topic=cloud-cli-install-ibmcloud-cli
[url-github-join]: https://github.com/join
[url-github-cli]: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
[url-githubdesktop]: https://desktop.github.com/
[url-node]: https://nodejs.org/es/download/


## Crear un cluster
En caso de no tener instalado el plugin container-service, corer el siguiente commando:
###
    ibmcloud plugin install container-service -r Bluemix
Para crear un cluster realizamos el siguiente comando:
###
    ibmcloud cs cluster-create --name <name-of-cluster>
Hacemos login a IBM Cloud:
###
    ibmcloud login 
Corremos el siguiente comando para ver si nuestro cluster esta en un estado “Normal”
###
    ibmcloud cs clusters
Corremos el siguiente comando para ver que nuestros workers estén en un estado “normal” con un estatus “ready”
###
    ibmcloud cs workers <yourclustername>
![](assets/4.png)<br/>
Tomamos nota de nuestra IP Pública (En mi caso 184.172.234.189)
## Configuración de kubectl
En nuestra línea de comandos corremos el siguiente comando:
###
    ibmcloud cs cluster-config <yourclustername>
Debería regresar una línea semejante a la siguiente:
###
    SET KUBECONFIG=C:\Users\Your_user\.bluemix\plugins\container-service\clusters\Track10\kube-config-hou02-Track10.yml
Corremos esta línea, estamos dirigiendo nuestra variable de ambiente hacia el archivo que bajó de nuestra configuración del cluster. Nota: recordar que para usar kubectl siempre tenemos que correr estos dos comandos

Para verificar que kubectl está bien configurado:<br/>
•	Corremos <i>kubectl cluster-info</i> esto debería regresarnos a que dirección IP está apuntando nuestro kubernetes master<br/>
•	Corremos <i>kubectl cluster-info dump</i> este comando debería regresarnos un dump de toda la información de nuestro cluster

## Troubleshooting
En caso de que alguno de estos dos comandos no funcione debemos reconfigurar el kubectl con los siguientes pasos:
###
    ibmcloud logout
    ibmcloud login
    ibmcloud cs region-set us-south
    ibmcloud cs cluster-config <yourclustername>
    Ejecutamos la línea que regresa el último comando (SET KUBECONFIG=C:…..)
    kubectl cluster-info
    kubectl cluster-info dump
Una vez que kubectl cluster info-dump contesta tenemos configurado correctamente kubectl, si en cualquier momento el comando nos regresa un error concerniente a que nuestro request no obtuvo respuesta volvemos a realizar los pasos del troubleshooting.

# DevOps con Kubernetes y Helm
Ahora veremos como automatizar los procesos necesarios para el despliegue de la aplicación con la herramienta de IBM Cloud “Countinuos delivery”. Esto nos permitira tener nuestro repositorio con una aplicación empaquetadacon Helm. HELM es el manejador de paquetes de Kubernetes que nos ayudara a usar preconfiguraciones para los propositos de automatizar. Ademas este servicio agrega una herramienta especial que revisa las vulenaribilidades de nuestro contenedor.

1. Entramos al dashboard de [**IBM Cloud**](https://cloud.ibm.com/login).<br/>
2. Entramos al apartado de CATALOG <br/>
![](assets/14.png)<br/>

3. Buscamos el servicio de Continuous Delivery y creamos el servicio<br/>
![](assets/15.png)<br/>

4. En la pantalla de inicio del servicio, nos vamos al apartado "Getting Started" y damos clic en el apartado "toolchain template" <br/>
![](assets/16.png)<br/>

5. Usamos el template de Kubernetes con Helm<br/>
![](assets/17.png)<br/>

6. Nos aseguramos que aparezcan los datos de esta manera (Se genera automáticamente)<br/>
![](assets/19.png)<br/>

7. Damos clic en el apartado delivery pipeline y creamos una API Key con el botón "New"<br/>
![](assets/20.png)<br/>

## Considerar lo siguiente<br/>
•	EL nombre de registro de contenedor debe ser un espacio que ya exista<br/>
•	Usaremos el cluster que creamos anteriormente llenando el apartado de "cluster name"<br/>
•	Si el namespace no existe dentro del cluster este sera creado automáticamente.<br/>
•	Si el espacio “prod” no existe dentro del cluster este sera creado.<br/>

Una vez que le demos crear podremos vizualisar nuestras herramientas. Entre ellas nuestro Delivery Pipeline que se encargara de crear los procesos que automatizaremos<br/>
![](assets/21.png)<br/>

7. Entramos a nuestra herramienta “Delivery Pipeline”<br/>
![](assets/22.png)<br/>

Como podemos observar, cuando creamos la cadena de herramientas, esta automaticamente genero los procesos necesarios para realizar el despliegue. Entre los que se encuentran el “Build” donde se revisa la dockerizacion de nuestra aplicación.
Validate en donde se utiliza el servicio de “Vulnerability advisor” el cual revisara nuestras vulnerabilidades.
Y por ultimo el despliegue de la aplicación en un POD<br/>

8. En la etapa de Producción, debajo de los registros del despliegue podremos ver la url de nuestra aplicación desplegada.<br/>

![](assets/23.png)<br/>

![](assets/24.png)<br/>

Si entramos a esta url podremos ver nuestra aplicación corriendo con un simple “Welcome to Bluemix DevOps with Docker, Kubernetes and Helm Charts. Lets go use the Continuous Delivery Service”
