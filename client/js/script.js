
window.onload = init;
function init() {
    Vue.use(VueMaterial.default)

    new Vue({
        el: "#app",
        name:'DialogCustom',
        data: {
            restaurants: [],
            id: null,
            nom: '',
            cuisine: '',
            nom2: '',
            cuisine2: '',
            nbRestaurants:0,
            page:0,
            pagesize:10,
            name:"",
            showDialog: false
        },
        mounted() {
            console.log("AVANT AFFICHAGE");
            this.getRestaurantsFromServer();
        },
        methods: {
            getRestaurantsFromServer() {
                let url = "http://localhost:8080/api/restaurants?page=" +
                    this.page + "&pagesize=" +
                    this.pagesize + "&name=" +
                    this.name;

                fetch(url)
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                this.restaurants = reponseJS.data;
                                this.nbRestaurants = reponseJS.count;
                                console.log(reponseJS.msg);
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            supprimerRestaurant(index) {
                //this.restaurants.splice(index, 1);
                console.log(index)
                let url = "http://localhost:8080/api/restaurants/";
                fetch(url + index ,{
                    method: "DELETE"
                })
                .then((reponseJSON) => {
                    reponseJSON.json()
                        .then((reponseJS) => {
                            console.log(reponseJS.msg);
                            // On re-affiche les restaurants
                            this.getRestaurantsFromServer();
                        });
                })
                .catch(function (err) {
                    console.log(err);
                });


            },modifierRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // Récupération du contenu du formulaire pour envoi en AJAX au serveur
                // 1 - on récupère le formulaire
                let inputs = document.querySelectorAll("#form2 input");// event.target;
                let id = document.querySelectorAll("#form2 input")[0].value

                console.log("nb inputs :"  + inputs.length)

                // 2 - on récupère le contenu du formulaire
                document.querySelectorAll("form2 md-input");
                
                let dataFormulaire = new FormData();
                inputs.forEach((i) => {
                    dataFormulaire.append(i.id, i.value);
                    console.log("INPUT VALUE name: " + i.id + " / value: " + i.value);
                })
                
                console.log(id)
                

                
                let url = "http://localhost:8080/api/restaurants/";

                fetch(url + id, {
                        method: "PUT",
                        body: dataFormulaire
                    })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                // On re-affiche les restaurants
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });

                this.nom2 = "";
                this.cuisine2 = "";
                this.id = ""
                
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                // Récupération du contenu du formulaire pour envoi en AJAX au serveur
                // 1 - on récupère le formulaire
                let inputs = document.querySelectorAll("#form1 input");// event.target;

                console.log("nb inputs :"  + inputs.length)

                // 2 - on récupère le contenu du formulaire
                document.querySelectorAll("form1 md-input");
                
                let dataFormulaire = new FormData();
                inputs.forEach((i) => {
                    dataFormulaire.append(i.id, i.value);
                    console.log("INPUT VALUE name: " + i.id + " / value: " + i.value);
                })
                
                this.nom = "";
                this.cuisine = "";

                // 3 - on envoie une requête POST pour insertion sur le serveur
                let url = "http://localhost:8080/api/restaurants";

                fetch(url, {
                        method: "POST",
                        body: dataFormulaire
                    })
                    .then((reponseJSON) => {
                        reponseJSON.json()
                            .then((reponseJS) => {
                                console.log(reponseJS.msg);
                                // On re-affiche les restaurants
                                this.getRestaurantsFromServer();
                            });
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
                
            },
            onPagination(){
                
            },
            getNbrestaurant(){
                return 1
            },
            getColor(index) {
                return (index % 2) ? 'blank' : 'lightgrey';
            },
            
            pageSuivante() {
                if (this.page < this.pageMax()) {
                    this.page++;
                    this.getRestaurantsFromServer();
                }
            },
			
			pagePrecedente() {
                if (this.page > 0) {
                    this.page--;
                    this.getRestaurantsFromServer();
                }
            },
            pageMax(){
                let pagemax = 0
                if (this.nbRestaurants%10 != 0){
                    pagemax = (this.nbRestaurants - this.nbRestaurants%10)/ 10 ;
                }
                else {
                    pagemax = (this.nbRestaurants)/ 10 -1;
                }
                return pagemax
            },
			
			Dernierepage() {
                this.page = this.pageMax();
                console.log((this.nbRestaurants+1)%10);
                this.getRestaurantsFromServer();
            },
			
			Premierepage() {
                this.page=0;
                this.getRestaurantsFromServer();
            },
			
            chercherRestaurants: _.debounce(function () {
                this.page=0;
                this.getRestaurantsFromServer();

            }, 300)
			
        }
    })
}