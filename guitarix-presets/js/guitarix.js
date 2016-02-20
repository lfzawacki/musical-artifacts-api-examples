var presets_url = "https://musical-artifacts.com/artifacts.json?apps=guitarix";
// var presets_url = "presets.json";

$( document ).ready(function() {

  $.getJSON( presets_url, function( data ) {
    var items = [];
    $.each(data, function(_, preset) {
      var item = '<div class="preset dark-border">';

        item += '<div class="screw-border">';
          item += "<div class='header'>";
            item += '<h2 class="name">' + preset.name +'</h2>';
            item += '<span class="author">by ' + preset.author + '</span>';
          item += "</div>";

          item += '<div class="description">' + preset.description + '</div>';

          item += '<div class="tags">';
            $.each(preset.tags, function(_, tag) {
              item += '<span class="badge">' + tag + '</span>';
            });
          item += '</div>';

          item += "<div class='buttons'>";
            item += '<span class="download button"><a href="' + preset.file + '">';
              item += '<i class="fa fa-download"> </i> (' + preset.download_count + ')';
            item += '</a> </span>';
            item += '<span class="favorites button"> <i class="fa fa-star"> </i> (' + preset.favorite_count + ') </div>';
          item += "</div>";

        item += '</div>';
      item += '</div>';

      items.push(item);
    });

    $(items.join( "" )).appendTo( "#presets" );

    $('.loading-spinner').fadeOut(600);
    $('.container').fadeIn(600);

  });

});
