/*! @license pzpr.js v (c) 2009-2021 sabo2, MIT license
 *   https://github.com/sabo2/pzprv3 */

!function(a,b){"object"==typeof module&&module.exports?module.exports=[a,b]:pzpr.classmgr.makeCustom(a,b)}(["shugaku"],{MouseEvent:{inputModes:{edit:["number"],play:["futon","shade","unshade","clear"]},mouseinput:function(){switch(this.inputMode){case"number":case"number-":this.mouseinput_number();break;case"futon":this.mousestart||this.mousemove?this.inputFuton():this.mouseend&&this.inputFuton2();break;case"shade":case"unshade":case"clear":this.inputcell_shugaku();break;case"auto":this.mouseinput_auto()}},mouseinput_auto:function(){this.puzzle.playmode?"left"===this.btn?this.mousestart||this.mousemove?this.inputFuton():this.mouseend&&this.inputFuton2():"right"===this.btn&&(this.mousestart||this.mousemove)&&this.inputcell_shugaku():this.puzzle.editmode&&this.mousestart&&this.inputqnum()},inputFuton:function(){var a=this.getcell();if(null===this.inputData){if(a.isnull||a.isNum())return;return void(46===a.qans||1===a.qans||1===a.qsub?this.inputcell_shugaku():(this.mouseCell=a,this.inputData=41,this.firstPoint.set(this.inputPoint),a.draw()))}if(this.inputData<=3)this.inputcell_shugaku();else{var b=this.inputData,c=null;if(a.isnull);else if(this.mouseCell===a)this.inputData=41;else{var d=this.inputPoint.bx-this.firstPoint.bx,e=this.inputPoint.by-this.firstPoint.by,f=this.mouseCell.adjacent;d-e>0&&d+e>0?(c=f.right,this.inputData=45):d-e>0&&d+e<0?(c=f.top,this.inputData=42):d-e<0&&d+e>0?(c=f.bottom,this.inputData=43):d-e<0&&d+e<0&&(c=f.left,this.inputData=44),(null===c||c.isnull||c.isNum())&&(this.inputData=46)}b!==this.inputData&&this.mouseCell.drawaround()}},inputFuton2:function(){if(!(this.mouseCell.isnull||!this.inputData||this.inputData<=3)){var a=this.mouseCell;this.changeHalf(a),41!==this.inputData&&46!==this.inputData?(a.setQans(this.inputData),a.setQsub(0)):46===this.inputData?(a.setQans(41),a.setQsub(0)):41===a.qans?(a.setQans(46),a.setQsub(0)):"futon"===this.inputMode?46===a.qans?(a.setQans(0),a.setQsub(0)):(a.setQans(41),a.setQsub(0)):46===a.qans?(a.setQans(1),a.setQsub(0)):1===a.qans?(a.setQans(0),a.setQsub(1)):1===a.qsub?(a.setQans(0),a.setQsub(0)):(a.setQans(41),a.setQsub(0));var b=this.currentTargetADJ();b.isnull||(this.changeHalf(b),b.setQans({42:48,43:47,44:50,45:49}[this.inputData]),b.setQsub(0)),this.mousereset(),a.drawaround(),this.mouseCell=this.board.emptycell}},inputcell_shugaku:function(){var a=this.getcell();if(!a.isnull&&a!==this.mouseCell&&!a.isNum()){if(null===this.inputData)switch(this.inputMode){case"shade":this.inputData=1!==a.qans?1:3;break;case"unshade":this.inputData=1!==a.qsub?2:3;break;case"clear":case"futon":this.inputData=3;break;default:1===a.qans?this.inputData=2:1===a.qsub?this.inputData=3:this.inputData=1}this.changeHalf(a),this.mouseCell=a,a.setQans(1===this.inputData?1:0),a.setQsub(2===this.inputData?1:0),a.drawaround()}},changeHalf:function(a){var b=a.qans,c=a.adjacent,d=null;42===b||47===b?d=c.top:43===b||48===b?d=c.bottom:44===b||49===b?d=c.left:45!==b&&50!==b||(d=c.right),null===d||(d.qans>=42&&d.qans<=45?d.setQans(41):d.qans>=47&&d.qans<=50&&d.setQans(46))},currentTargetADJ:function(){if(!this.mouseCell.isnull){var a=this.mouseCell.adjacent;switch(this.inputData){case 42:return a.top;case 43:return a.bottom;case 44:return a.left;case 45:return a.right}}return this.board.emptycell}},KeyEvent:{enablemake:!0},Cell:{numberRemainsUnshaded:!0,maxnum:4,minnum:0,isPillow:function(){return this.qans>=41&&this.qans<=45}},Border:{isbdh_cc1:{41:1,42:1,44:1,45:1,46:1,47:1,49:1,50:1},isbdh_cc2:{41:1,43:1,44:1,45:1,46:1,48:1,49:1,50:1},isbdv_cc1:{41:1,42:1,43:1,44:1,46:1,47:1,48:1,49:1},isbdv_cc2:{41:1,42:1,43:1,45:1,46:1,47:1,48:1,50:1},isBorder:function(){var a=this.sidecell[0].qans,b=this.sidecell[1].qans;return this.isVert()?!!this.isbdv_cc1[a]||!!this.isbdv_cc2[b]:!!this.isbdh_cc1[a]||!!this.isbdh_cc2[b]}},Board:{hasborder:1},BoardExec:{adjustBoardData:function(a,b){var c={};switch(a){case this.FLIPY:c={42:43,43:42,47:48,48:47};break;case this.FLIPX:c={44:45,45:44,49:50,50:49};break;case this.TURNR:c={42:45,45:43,43:44,44:42,47:50,50:48,48:49,49:47};break;case this.TURNL:c={42:44,44:43,43:45,45:42,47:49,49:48,48:50,50:47};break;default:return}for(var d=this.board.cell,e=0;e<d.length;e++){var f=d[e],g=c[f.qans];g&&(f.qans=g)}}},AreaShadeGraph:{enabled:!0},Graphic:{hideHatena:!0,qanscolor:"black",bcolor:"rgb(208, 208, 208)",targetbgcolor:"rgb(255, 192, 192)",undefcolor:"silver",circleratio:[.47,.42],numbercolor_func:"qnum",paint:function(){this.drawBGCells(),this.drawShadedCells(),this.drawDotCells(),this.drawDashedGrid(),this.drawFutons(),this.drawPillows(),this.drawBorders(),this.drawCircles(),this.drawQuesNumbers(),this.drawChassis(),this.drawTarget()},getBGCellColor_error1:function(a){return this.puzzle.execConfig("undefcell")&&0===a.qans&&-1===a.qnum?this.undefcolor:1===a.error||1===a.qinfo?this.errbcolor1:null},drawFutons:function(){var a=this.vinc("cell_futon","crispEdges",!0),b=this.puzzle.mouse,c=null,d=null,e=!b.mouseCell.isnull&&null!==b.firstPoint.bx&&b.inputData>=40;e&&(c=b.mouseCell,d=b.currentTargetADJ());for(var f=this.range.cells,g=0;g<f.length;g++){var h=f[g],i=h.qans>=41,j=1===h.error?this.errbcolor1:"white";e&&(h!==c&&h!==d||(i=!0,j=this.targetbgcolor)),a.vid="c_futon_"+h.id,i?(a.fillStyle=j,a.fillRectCenter(h.bx*this.bw,h.by*this.bh,this.bw,this.bh)):a.vhide()}},drawPillows:function(){var a=this.vinc("cell_pillow","crispEdges",!0),b=this.puzzle.mouse,c=null,d=null,e=!b.mouseCell.isnull&&null!==b.firstPoint.bx;e&&(c=b.mouseCell,d=b.currentTargetADJ());for(var f=this.range.cells,g=.7*this.bw-1,h=.7*this.bh-1,i=0;i<f.length;i++){var j=f[i],k=j.qans>=41&&j.qans<=45;e&&(k||c!==j?k&&d===j&&(k=!1):k=!0),a.vid="c_pillow_"+j.id,k?(a.lineWidth=1,a.strokeStyle=j.trial?this.trialcolor:"black",e&&c===j?a.fillStyle=this.targetbgcolor:1===j.error?a.fillStyle=this.errbcolor1:a.fillStyle="white",a.shapeRectCenter(j.bx*this.bw,j.by*this.bh,g,h)):a.vhide()}},getBorderColor:function(a){var b=a.isBorder(),c=this.puzzle.mouse,d=!1,e=a.sidecell[0],f=a.sidecell[1];if(c.mouseCell.isnull||null===c.firstPoint.bx)d=(e.trial||0===e.qans)&&(f.trial||0===f.qans);else{var g=c.mouseCell,h=c.currentTargetADJ(),i=e===g||f===g,j=e===h||f===h;i&&j?b=!1:(i||j)&&(b=!0,this.board.trialstage>0&&(d=!0))}return b?d?this.trialcolor:this.shadecolor:null}},Encode:{decodePzpr:function(a){this.decodeShugaku()},encodePzpr:function(a){this.encodeShugaku()},decodeShugaku:function(){for(var a=0,b=this.outbstr,c=this.board,d=0;d<b.length;d++){var e=b.charAt(d),f=c.cell[a];if(e>="0"&&e<="4"?f.qnum=parseInt(e,36):"5"===e?f.qnum=-2:a+=parseInt(e,36)-6,a++,!c.cell[a])break}this.outbstr=b.substr(d+1)},encodeShugaku:function(){for(var a="",b=0,c=this.board,d=0;d<c.cell.length;d++){var e="",f=c.cell[d].qnum;-2===f?e="5":-1!==f?e=f.toString(36):b++,0===b?a+=e:(e||30===b)&&(a+=(5+b).toString(36)+e,b=0)}b>0&&(a+=(5+b).toString(36)),this.outbstr+=a}},FileIO:{decodeData:function(){this.decodeCell(function(a,b){"5"===b?a.qnum=-2:"#"===b?a.qans=1:"-"===b?a.qsub=1:b>="a"&&b<="j"?a.qans=parseInt(b,20)+31:"."!==b&&(a.qnum=+b)})},encodeData:function(){this.encodeCell(function(a){return a.qnum>=0?a.qnum+" ":-2===a.qnum?"5 ":1===a.qans?"# ":a.qans>=41?(a.qans-31).toString(20)+" ":1===a.qsub?"- ":". "})}},AnsCheck:{checklist:["checkKitamakura","check2x2ShadeCell","checkDir4PillowOver","checkFullSizeFuton","checkFutonAisle","checkConnectShade","checkDir4PillowLess","checkEmptyCell_shugaku+"],checkDir4PillowOver:function(){this.checkDir4Cell(function(a){return a.isPillow()},2,"nmPillowGt")},checkDir4PillowLess:function(){this.checkDir4Cell(function(a){return a.isPillow()},1,"nmPillowLt")},checkFullSizeFuton:function(){this.checkAllCell(function(a){return 41===a.qans||46===a.qans},"futonHalf")},checkEmptyCell_shugaku:function(){this.checkAllCell(function(a){return a.noNum()&&0===a.qans},"ceEmpty")},checkKitamakura:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b];if(43===c.qans){if(this.failcode.add("kitamakura"),this.checkOnly)break;c.seterr(1),c.adjacent.bottom.seterr(1)}}},checkFutonAisle:function(){for(var a=this.board,b=0;b<a.cell.length;b++){var c=a.cell[b];if(!c.isNum()){var d=c.adjacent,e=null;switch(c.qans){case 42:e=d.top;break;case 43:e=d.bottom;break;case 44:e=d.left;break;case 45:e=d.right;break;default:continue}if(!(c.countDir4Cell(function(a){return a.isShade()})>0||e.countDir4Cell(function(a){return a.isShade()})>0)){if(this.failcode.add("futonMidPos"),this.checkOnly)break;c.seterr(1),e.seterr(1)}}}}},FailCode:{csDivide:["通路が分断されています。","The aisle is divided."],nmPillowGt:["柱のまわりにある枕の数が間違っています。","The number of pillows around the number is wrong."],nmPillowLt:["柱のまわりにある枕の数が間違っています。","The number of pillows around the number is wrong."],kitamakura:["北枕になっている布団があります。","There is a futon that faces down."],futonHalf:["布団が2マスになっていません。","There is a half-size futon."],futonMidPos:["通路に接していない布団があります。","There is a futon that is not connected to the aisle."],ceEmpty:["布団でも黒マスでもないマスがあります。","There is an empty cell."]}});
//# sourceMappingURL=shugaku.js.map