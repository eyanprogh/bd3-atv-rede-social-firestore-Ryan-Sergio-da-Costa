/*
    ########## LISTAGEM DOS POSTS ##########
*/

/* CAPTURA A DIV ONDE OS POSTS SERÃO MOSTRADOS */
const postsContainer = document.querySelector(".posts_container");

/* FUNÇÃO PARA RENDERIZAR OS POSTS */
function renderPost(doc) {
  // CRIAÇÃO DOS ELEMENTOS HTML
  let postDiv = document.createElement("div");
  let titulo = document.createElement("h1");
  let texto = document.createElement("p");
  let tempo = document.createElement("span");
  let excluir = document.createElement("button");

  // CLASSE CSS
  postDiv.classList.add("Nano");

  // BOTÃO EXCLUIR
  excluir.textContent = "EXCLUIR";

  // DEFINE O ID DO DOCUMENTO
  postDiv.setAttribute("data-id", doc.id);

  // DADOS DO FIREBASE
  titulo.textContent = doc.data().titulo;
  texto.textContent = doc.data().post;
  tempo.textContent = new Date(doc.data().tempo).toLocaleString("pt-BR");

  // ADICIONA ELEMENTOS
  postDiv.appendChild(titulo);
  postDiv.appendChild(texto);
  postDiv.appendChild(tempo);
  postDiv.appendChild(excluir);

  // MOSTRA NA TELA
  postsContainer.appendChild(postDiv);

  /*
      ########## EXCLUIR POST ##########
  */

  excluir.addEventListener("click", (event) => {
    event.stopPropagation();

    let id = event.target.parentElement.getAttribute("data-id");

    db.collection("Nano")
      .doc(id)
      .delete()
      .then(() => {
        window.location.reload();
      });
  });
}

/*
    ########## BUSCAR POSTS ##########
*/

db.collection("Nano")
  .orderBy("tempo", "desc")
  .onSnapshot((snapshot) => {
    postsContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      renderPost(doc);
    });
  })
  .catch((error) => {
    console.log("ERRO AO BUSCAR POSTS:", error);
  });

/*
    ########## CADASTRAR POSTS ##########
*/

const form = document.querySelector("#frm_post");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  db.collection("Nano").add({
      titulo: form.txt_titulo.value,
      post: form.txt_post.value,
      tempo: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      // LIMPA CAMPOS
      form.txt_titulo.value = "";
      form.txt_post.value = "";
      // FECHA MODAL
      modal.style.display = "none";
      
      // RECARREGA
      window.location.reload();
    }).catch((error) => {console.log("ERRO AO SALVAR:", error);
 
  });
});
