
// https://qiita.com/opengl-8080/items/ac19deec388c357cd498
      
var grid = document.getElementById('grid');

// https://handsontable.com/
var table = new Handsontable(grid, {
    data: data = [],
    // dataSchema: {
    //     postcode: null,
    //     prefname: null,
    //     address: null,
    // },
    columns: [
        {data: 'postcode'}, //郵便番号
        {data: 'prefname'}, //都道府県
        {data: 'address'},  //住所
    ],
    minSpareRows: 0,                               // 最低空白行
    colHeaders: ['郵便番号', '都道府県', '住所'],    // ヘッダ表示 列
    rowHeaders: true,                              // ヘッダ表示 行
    autoColumnSize: true                           // カラム幅自動調整...ただし、ブラウザ側でデフォルトの表示倍率を変更していると正しく動作しない.
});

// https://www.tam-tam.co.jp/tipsnote/javascript/post11736.html
var file = document.getElementById('file');
var masterdataCount = document.getElementById('masterdataCount');

csv_data = [];
if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalCsv(e) {

        var fileData = e.target.files[0];
        console.log(fileData); // 取得した内容の確認用
   
        file.value = null;
        var cols = null;

        // CSVファイル以外は処理を止める
        if(!fileData.name.match('.csv$')) {
            alert('CSVファイルを選択してください');
            return;
        }
    
        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
            var rows = reader.result.split('\n');
            console.info( rows.length, "件...読み出しました." );
            csv_data.length = data.length = 0;
            for (var i = 1; i < rows.length; i++) {
                row = rows[i].split(',');
                var obj = { postcode: row[4],
                            prefname: row[7],
                            address:  (row[7]+row[9]+row[11]) };
                data.push( obj );
                masterdataCount.textContent = i.toLocaleString();
            }
            csv_data = data.slice();
            table.render(); // 内部データをGUIへ反映
            // 検索用メモリの作成
            rows = null;
        }
        // ファイル読み込みを実行
        reader.readAsText(fileData);
    }
    file.addEventListener('change', loadLocalCsv, false);
    
} else {
    file.style.display = 'none';
    result.innerHTML = 'このブラウザには対応していません.';
}

// ボタンを押下した場合は、入力した場合に検索する.
// TODO: 画面上で編集していたら反映しないとダメなんだけど、まだ反映していないよ。
$('#searchPostCode').on('click', searchPostCode);
$('#searchword').on('input', searchPostCode);
function searchPostCode() 
{
    if( 0 == csv_data.length ) return ;
    var result = null;

    var reg = new RegExp("[^0-9\-]");   // 数字とハイフンじゃない 条件
    var searchText = $(this).val();     // 検索ボックスに入力された値

    if (searchText.match( reg ) ){
        result = csv_data.filter( function( value ) {
            return (value.address.indexOf( searchText ) >= 0 ? true : false)
        })
    } else {
        result = csv_data.filter( function( value ) {
            return (value.postcode.indexOf( searchText ) == 0 ? true : false)
        })
    }
    data.length = 0;
    for( i = 0 ; i < result.length ; i++ ){ // データをdataにコピーしたいんだけど.参照渡しじゃなくて値渡しでコピーする方法はないのかな？
        data.push( result[i]);
    }
    table.render(); // 内部データをGUIへ反映
}

