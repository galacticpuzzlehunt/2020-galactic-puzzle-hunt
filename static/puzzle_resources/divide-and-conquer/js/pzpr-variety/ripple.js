/*! @license pzpr.js v (c) 2009-2021 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["ripple","cojun","meander"],{MouseEvent:{inputModes:{edit:["border","number","clear"],play:["number","clear"]},mouseinput_auto:function(){this.puzzle.playmode?this.mousestart&&this.inputqnum():this.puzzle.editmode&&(this.mousestart||this.mousemove&&"left"===this.btn?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())}},"MouseEvent@meander":{inputModes:{edit:["border","number","clear"],play:["number","dragnum+","dragnum-","clear"]},mouseinput:function(){0===this.inputMode.indexOf("dragnum")?this.dragnumber_meander():this.common.mouseinput.call(this)},mouseinput_auto:function(){this.puzzle.playmode?((this.mousestart||this.mousemove)&&this.dragnumber_meander(),this.mouseend&&this.notInputted()&&this.inputqnum_meander()):this.puzzle.editmode&&(this.mousestart||this.mousemove&&"left"===this.btn?this.inputborder():this.mouseend&&this.notInputted()&&this.inputqnum())},dragnumber_meander:function(){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell){if(this.mouseCell.isnull)return a.isNum()&&(this.inputData=a.getNum()),void(this.mouseCell=a);if(a.room!==this.mouseCell.room)return this.inputData=0,void(this.mouseCell=a);if(-1!==a.qnum)return this.inputData=a.qnum,void(this.mouseCell=a);if(this.inputData>=1&&this.inputData<=a.room.nodes.length){if("dragnum+"===this.inputMode||"auto"===this.inputMode&&"left"===this.btn?this.inputData++:this.inputData--,this.inputData>=1&&this.inputData<=a.room.nodes.length)a.clrSnum(),a.setQdir(0),a.setAnum(this.inputData),a.setQsub(0);else if(this.inputData>a.room.nodes.length)return void(this.inputData=0);this.mouseCell=a,a.draw()}}},inputqnum_meander:function(){this.getcell().isnull||(this.mouseCell=this.board.emptycell,this.inputqnum())}},KeyEvent:{enablemake:!0,enableplay:!0},Cell:{enableSubNumberArray:!0,maxnum:function(){return this.room.clist.length}},Board:{hasborder:1},"Board@cojun":{cols:8,rows:8},AreaRoomGraph:{enabled:!0},Graphic:{gridcolor_type:"DLIGHT",paint:function(){this.drawBGCells(),this.drawTargetSubNumber(),this.drawGrid(),this.drawSubNumbers(),this.drawAnsNumbers(),this.drawQuesNumbers(),this.drawBorders(),this.drawChassis(),this.drawCursor()}},Encode:{decodePzpr:function(a){this.decodeBorder(),this.decodeNumber16()},encodePzpr:function(a){this.encodeBorder(),this.encodeNumber16()},decodeKanpen:function(){this.fio.decodeAreaRoom(),this.fio.decodeCellQnum_kanpen()},encodeKanpen:function(){this.fio.encodeAreaRoom(),this.fio.encodeCellQnum_kanpen()}},FileIO:{decodeData:function(){this.decodeBorderQues(),this.decodeCellQnum(),this.decodeCellAnumsub()},encodeData:function(){this.encodeBorderQues(),this.encodeCellQnum(),this.encodeCellAnumsub()},kanpenOpen:function(){this.decodeAreaRoom(),this.decodeCellQnum_kanpen(),this.decodeCellAnum_kanpen()},kanpenSave:function(){this.encodeAreaRoom(),this.encodeCellQnum_kanpen(),this.encodeCellAnum_kanpen()},kanpenOpenXML:function(){this.decodeAreaRoom_XMLBoard(),this.decodeCellQnum_XMLBoard(),this.decodeCellAnum_XMLAnswer()},kanpenSaveXML:function(){this.encodeAreaRoom_XMLBoard(),this.encodeCellQnum_XMLBoard(),this.encodeCellAnum_XMLAnswer()},UNDECIDED_NUM_XML:0},AnsCheck:{checklist:["checkDifferentNumberInRoom","checkRippleNumber@ripple","checkAdjacentDiffNumber@cojun","checkUpperNumber@cojun","checkAdjacentNumbers@meander","checkConsecutiveNeighbors@meander","checkNoNumCell+"],checkRippleNumber:function(){var a=!0,b=this.board;a:for(var c=0;c<b.cell.length;c++){var d=b.cell[c],e=d.getNum(),f=d.bx,g=d.by;if(!(e<=0)){for(var h=2;h<=2*e;h+=2){var i=b.getc(f+h,g);if(!i.isnull&&i.getNum()===e){if(a=!1,this.checkOnly)break a;d.seterr(1),i.seterr(1)}}for(var h=2;h<=2*e;h+=2){var i=b.getc(f,g+h);if(!i.isnull&&i.getNum()===e){if(a=!1,this.checkOnly)break a;d.seterr(1),i.seterr(1)}}}}a||this.failcode.add("nmSmallGap")},checkUpperNumber:function(){for(var a=this.board,b=0;b<a.cell.length-a.cols;b++){var c=a.cell[b],d=c.adjacent.bottom;if(c.room===d.room&&c.isNum()&&d.isNum()&&!(c.getNum()>=d.getNum())){if(this.failcode.add("bkSmallOnBig"),this.checkOnly)break;c.seterr(1),d.seterr(1)}}},checkAdjacentNumbers:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b];if(c.isNum()){var d=c.bx,e=c.by,f=new this.klass.CellList,g=a.cellinside(d,e,d+2,e+2);f.add(c),g.add(a.getc(d-2,e+2));for(var h=0;h<g.length;h++){var i=g[h];c!==i&&i.isNum()&&c.getNum()===i.getNum()&&f.add(i)}if(!(f.length<=1)){if(this.failcode.add("nmAround"),this.checkOnly)break;f.seterr(1)}}}},checkConsecutiveNeighbors:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b];if(c.isNum()){var d=c.getNum(),e=c.room.nodes.length;if(d>1&&c.countDir4Cell(function(a){return a.isNum()&&c.room===a.room&&a.getNum()===d-1})<=0||d<e&&c.countDir4Cell(function(a){return a.isNum()&&c.room===a.room&&a.getNum()===d+1})<=0){if(this.failcode.add("nmNotConsecNeighbors"),this.checkOnly)break;c.seterr(1)}}}}},FailCode:{bkDupNum:["1つの部屋に同じ数字が複数入っています。","A room has two or more same numbers."],bkSmallOnBig:["同じ部屋で上に小さい数字が乗っています。","There is a smaller number on top of a bigger number in a room."],nmSmallGap:["数字よりもその間隔が短いところがあります。","The distance between two equal numbers is smaller than the number."],nmAround:["同じ数字がタテヨコナナメに隣接しています。","Equal numbers touch."],nmNotConsecNeighbors:["連続する数字がタテヨコに隣り合っていません。","A number is not the neighbor of its consecutive numbers."]}});
//# sourceMappingURL=ripple.js.map