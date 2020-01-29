/**
 * Prepare the guestbook entry to be persisted
 */
function main(params) {
  if (!params.nombre || !params.comentario) {
    return Promise.reject({error: 'no hay nombre o comentario'});
  }

	return {
    doc: {
      createdAt: new Date(),
	    name: params.nombre,
	    email: params.correo,
	    comment: params.comentario,
	  }
  };
}
