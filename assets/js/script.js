$(document).ready(function(){
		$(".leads").submit(function(e){
		    e.preventDefault();
			var data = {};
			data.nome = $("input[name='nome']").val();
			data.email = $("input[name='email']").val();

			$.ajax({
				method: "POST",
				url: "https://gerenciando-talentos.herokuapp.com/api/createLead",
				data: data
			}).done(function(data) {
				$(".leads").html("<a href='http://gerenciandotalentos.com.br/public/5-maneiras-de-manter-funcionarios-motivados.pdf' class='link-download' target='_blank'>Baixe seu e-Book!</a>");
			});
		});
	});