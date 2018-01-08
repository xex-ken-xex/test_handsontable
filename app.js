
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
var result = document.getElementById('result');
if(window.File && window.FileReader && window.FileList && window.Blob) {
    function loadLocalCsv(e) {
        // ファイル情報を取得
        var fileData = e.target.files[0];
        console.log(fileData); // 取得した内容の確認用
   
        // CSVファイル以外は処理を止める
        // todo: Excelが入っているとここが変な挙動になる？ → 要調査
        if(!fileData.name.match('.csv$')) {
            alert('CSVファイルを選択してください');
            file.value = null;
            return;
        }
    
        // FileReaderオブジェクトを使ってファイル読み込み
        var reader = new FileReader();
        var cols = null;
        
        // ファイル読み込みに成功したときの処理
        reader.onload = function() {
            var rows = reader.result.split('\n');
            console.info( rows.length, "件...読み出しました." );
            data.length = 0;
            for (var i = 1; i < rows.length; i++) {
                row = rows[i].split(',');
                var obj = { postcode: row[4],
                            prefname: row[7],
                            address:  (row[7]+row[9]+row[11]) };
                data.push( obj );
            }
            rows = null;
            table.render(); // 内部データをGUIへ反映
        }
        // ファイル読み込みを実行
        reader.readAsText(fileData);
    }
    file.addEventListener('change', loadLocalCsv, false);
    
} else {
    file.style.display = 'none';
    result.innerHTML = 'このブラウザには対応していません.';
}

var searchbtn = document.getElementById('search');
searchbtn.addEventListener('click', searchPostCode );
function searchPostCode() 
{
    // 【処理内容】
    // 検索結果行にあるデータを削除、一番上の行へ検索用マーカーを移動させる
    // 検索対象の行を見つける
    // 検索条件列に入っていた（3つのパラメータを確認して）ら、検索を実行
    // 検索結果が1より大きかった場合は、行を足す
    //     table.alter('insert_row', 0);
    //     検索対象の行のため、追加した数ぶん下に検索用マーカーを移動
    // 検索結果を右側に転記する
}

