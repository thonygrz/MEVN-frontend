(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["clients"],{"2b5d":function(e,t,n){"use strict";n("7db0"),n("c975"),n("fb6a"),n("a434"),n("b0c0"),n("d3b7"),n("25f0"),n("8a79");var i=n("5530"),s=(n("2bfd"),n("b974")),a=(n("4de4"),n("d81d"),n("45fc"),n("498a"),n("8654")),o=n("d9f7"),r=n("80d2"),l=Object(i["a"])(Object(i["a"])({},s["b"]),{},{offsetY:!0,offsetOverflow:!0,transition:!1}),c=s["a"].extend({name:"v-autocomplete",props:{allowOverflow:{type:Boolean,default:!0},autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:function(e,t,n){return n.toLocaleLowerCase().indexOf(t.toLocaleLowerCase())>-1}},hideNoData:Boolean,menuProps:{type:s["a"].options.props.menuProps.type,default:function(){return l}},noFilter:Boolean,searchInput:{type:String,default:void 0}},data:function(){return{lazySearch:this.searchInput}},computed:{classes:function(){return Object(i["a"])(Object(i["a"])({},s["a"].options.computed.classes.call(this)),{},{"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1})},computedItems:function(){return this.filteredItems},selectedValues:function(){var e=this;return this.selectedItems.map((function(t){return e.getValue(t)}))},hasDisplayedItems:function(){var e=this;return this.hideSelected?this.filteredItems.some((function(t){return!e.hasItem(t)})):this.filteredItems.length>0},currentRange:function(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems:function(){var e=this;return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter((function(t){var n=Object(r["q"])(t,e.itemText),i=null!=n?String(n):"";return e.filter(t,String(e.internalSearch),i)}))},internalSearch:{get:function(){return this.lazySearch},set:function(e){this.lazySearch=e,this.$emit("update:search-input",e)}},isAnyValueAllowed:function(){return!1},isDirty:function(){return this.searchIsDirty||this.selectedItems.length>0},isSearching:function(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps:function(){var e=s["a"].options.computed.$_menuProps.call(this);return e.contentClass="v-autocomplete__content ".concat(e.contentClass||"").trim(),Object(i["a"])(Object(i["a"])({},l),e)},searchIsDirty:function(){return null!=this.internalSearch&&""!==this.internalSearch},selectedItem:function(){var e=this;return this.multiple?null:this.selectedItems.find((function(t){return e.valueComparator(e.getValue(t),e.getValue(e.internalValue))}))},listData:function(){var e=s["a"].options.computed.listData.call(this);return e.props=Object(i["a"])(Object(i["a"])({},e.props),{},{items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch}),e}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused:function(e){e?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.updateSelf())},isMenuActive:function(e){!e&&this.hasSlot&&(this.lazySearch=void 0)},items:function(e,t){t&&t.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!e.length||this.activateMenu()},searchInput:function(e){this.lazySearch=e},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created:function(){this.setSearch()},destroyed:function(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged:function(e,t){var n=this;e!==t&&(this.setMenuIndex(-1),this.$nextTick((function(){n.internalSearch&&(1===e.length||n.autoSelectFirst)&&(n.$refs.menu.getTiles(),n.setMenuIndex(0))})))},onInternalSearchChanged:function(){this.updateMenuDimensions()},updateMenuDimensions:function(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex:function(e){this.searchIsDirty||(this.multiple&&e===r["w"].left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&e===r["w"].right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:e!==r["w"].backspace&&e!==r["w"].delete||this.deleteCurrentItem())},deleteCurrentItem:function(){var e=this.selectedIndex,t=this.selectedItems[e];if(this.isInteractive&&!this.getDisabled(t)){var n=this.selectedItems.length-1;if(-1!==this.selectedIndex||0===n){var i=this.selectedItems.length,s=e!==i-1?e:e-1,a=this.selectedItems[s];a?this.selectItem(t):this.setValue(this.multiple?[]:void 0),this.selectedIndex=s}else this.selectedIndex=n}},clearableCallback:function(){this.internalSearch=void 0,s["a"].options.methods.clearableCallback.call(this)},genInput:function(){var e=a["a"].options.methods.genInput.call(this);return e.data=Object(o["a"])(e.data,{attrs:{"aria-activedescendant":Object(r["o"])(this.$refs.menu,"activeTile.id"),autocomplete:Object(r["o"])(e.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),e},genInputSlot:function(){var e=s["a"].options.methods.genInputSlot.call(this);return e.data.attrs.role="combobox",e},genSelections:function(){return this.hasSlot||this.multiple?s["a"].options.methods.genSelections.call(this):[]},onClick:function(e){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(e.target)||this.activateMenu())},onInput:function(e){if(!(this.selectedIndex>-1)&&e.target){var t=e.target,n=t.value;t.value&&this.activateMenu(),this.internalSearch=n,this.badInput=t.validity&&t.validity.badInput}},onKeyDown:function(e){var t=e.keyCode;s["a"].options.methods.onKeyDown.call(this,e),this.changeSelectedIndex(t)},onSpaceDown:function(e){},onTabDown:function(e){s["a"].options.methods.onTabDown.call(this,e),this.updateSelf()},onUpDown:function(e){e.preventDefault(),this.activateMenu()},selectItem:function(e){s["a"].options.methods.selectItem.call(this,e),this.setSearch()},setSelectedItems:function(){s["a"].options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch:function(){var e=this;this.$nextTick((function(){e.multiple&&e.internalSearch&&e.isMenuActive||(e.internalSearch=!e.selectedItems.length||e.multiple||e.hasSlot?null:e.getText(e.selectedItem))}))},updateSelf:function(){(this.searchIsDirty||this.internalValue)&&(this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem:function(e){return this.selectedValues.indexOf(this.getValue(e))>-1},onCopy:function(e){var t,n;if(-1!==this.selectedIndex){var i=this.selectedItems[this.selectedIndex],s=this.getText(i);null==(t=e.clipboardData)||t.setData("text/plain",s),null==(n=e.clipboardData)||n.setData("text/vnd.vuetify.autocomplete.item+plain",s),e.preventDefault()}}}});t["a"]=c.extend({name:"v-combobox",props:{delimiters:{type:Array,default:function(){return[]}},returnObject:{type:Boolean,default:!0}},data:function(){return{editingIndex:-1}},computed:{computedCounterValue:function(){return this.multiple?this.selectedItems.length:(this.internalSearch||"").toString().length},hasSlot:function(){return s["a"].options.computed.hasSlot.call(this)||this.multiple},isAnyValueAllowed:function(){return!0},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!!this.$slots["no-data"]&&!this.hideNoData)}},methods:{onInternalSearchChanged:function(e){if(e&&this.multiple&&this.delimiters.length){var t=this.delimiters.find((function(t){return e.endsWith(t)}));null!=t&&(this.internalSearch=e.slice(0,e.length-t.length),this.updateTags())}this.updateMenuDimensions()},genInput:function(){var e=c.options.methods.genInput.call(this);return delete e.data.attrs.name,e.data.on.paste=this.onPaste,e},genChipSelection:function(e,t){var n=this,a=s["a"].options.methods.genChipSelection.call(this,e,t);return this.multiple&&(a.componentOptions.listeners=Object(i["a"])(Object(i["a"])({},a.componentOptions.listeners),{},{dblclick:function(){n.editingIndex=t,n.internalSearch=n.getText(e),n.selectedIndex=-1}})),a},onChipInput:function(e){s["a"].options.methods.onChipInput.call(this,e),this.editingIndex=-1},onEnterDown:function(e){e.preventDefault(),this.getMenuIndex()>-1||this.$nextTick(this.updateSelf)},onFilteredItemsChanged:function(e,t){this.autoSelectFirst&&c.options.methods.onFilteredItemsChanged.call(this,e,t)},onKeyDown:function(e){var t=e.keyCode;s["a"].options.methods.onKeyDown.call(this,e),this.multiple&&t===r["w"].left&&0===this.$refs.input.selectionStart?this.updateSelf():t===r["w"].enter&&this.onEnterDown(e),this.changeSelectedIndex(t)},onTabDown:function(e){if(this.multiple&&this.internalSearch&&-1===this.getMenuIndex())return e.preventDefault(),e.stopPropagation(),this.updateTags();c.options.methods.onTabDown.call(this,e)},selectItem:function(e){this.editingIndex>-1?this.updateEditing():c.options.methods.selectItem.call(this,e)},setSelectedItems:function(){null==this.internalValue||""===this.internalValue?this.selectedItems=[]:this.selectedItems=this.multiple?this.internalValue:[this.internalValue]},setValue:function(e){var t;s["a"].options.methods.setValue.call(this,null!=(t=e)?t:this.internalSearch)},updateEditing:function(){var e=this.internalValue.slice();e[this.editingIndex]=this.internalSearch,this.setValue(e),this.editingIndex=-1},updateCombobox:function(){var e=Boolean(this.$scopedSlots.selection)||this.hasChips;e&&!this.searchIsDirty||(this.internalSearch!==this.getText(this.internalValue)&&this.setValue(),e&&(this.internalSearch=void 0))},updateSelf:function(){this.multiple?this.updateTags():this.updateCombobox()},updateTags:function(){var e=this.getMenuIndex();if(!(e<0)||this.searchIsDirty){if(this.editingIndex>-1)return this.updateEditing();var t=this.selectedItems.indexOf(this.internalSearch);if(t>-1){var n=this.internalValue.slice();n.splice(t,1),this.setValue(n)}if(e>-1)return this.internalSearch=null;this.selectItem(this.internalSearch),this.internalSearch=null}},onPaste:function(e){var t;if(this.multiple&&!this.searchIsDirty){var n=null==(t=e.clipboardData)?void 0:t.getData("text/vnd.vuetify.autocomplete.item+plain");n&&-1===this.findExistingIndex(n)&&(e.preventDefault(),s["a"].options.methods.selectItem.call(this,n))}}}})},"2bfd":function(e,t,n){},"58f3":function(e,t,n){"use strict";n.r(t);var i=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("v-data-table",{staticClass:"elevation-1",attrs:{headers:e.headers,items:e.clientes,search:e.search},scopedSlots:e._u([{key:"top",fn:function(){return[n("v-toolbar",{attrs:{flat:""}},[n("v-toolbar-title",[e._v("Clientes")]),n("v-divider",{staticClass:"mx-4",attrs:{inset:"",vertical:""}}),n("v-text-field",{attrs:{"prepend-icon":"mdi-magnify",label:"Buscar","single-line":"","hide-details":"",justify:"center"},model:{value:e.search,callback:function(t){e.search=t},expression:"search"}}),n("v-spacer"),n("v-dialog",{attrs:{"max-width":"600px"},scopedSlots:e._u([{key:"activator",fn:function(t){var i=t.on,s=t.attrs;return[n("v-btn",e._g(e._b({staticClass:"mb-2",attrs:{color:"primary",dark:""}},"v-btn",s,!1),i),[e._v(" Nuevo Item ")])]}}]),model:{value:e.dialog,callback:function(t){e.dialog=t},expression:"dialog"}},[n("v-card",[n("v-card-title",[n("span",{staticClass:"headline"},[e._v(e._s(e.formTitle))])]),n("v-form",{ref:"form",attrs:{"lazy-validation":""},model:{value:e.valid,callback:function(t){e.valid=t},expression:"valid"}},[n("v-card-text",[n("v-container",[n("v-row",[n("v-col",{attrs:{cols:"12",sm:"12"}},[n("v-text-field",{attrs:{label:"Nombre",counter:50,rules:[e.rules.required,e.rules.min]},model:{value:e.nombre,callback:function(t){e.nombre=t},expression:"nombre"}})],1),n("v-col",{attrs:{cols:"12",sm:"6"}},[n("v-combobox",{attrs:{label:"Tipo de persona",items:["Cliente","Proveedor"],rules:[e.rules.required]},model:{value:e.tipoPersona,callback:function(t){e.tipoPersona=t},expression:"tipoPersona"}})],1),n("v-col",{attrs:{cols:"12",sm:"6"}},[n("v-text-field",{attrs:{label:"Correo",rules:[e.rules.required]},model:{value:e.email,callback:function(t){e.email=t},expression:"email"}})],1),n("v-col",{attrs:{cols:"12",sm:"4"}},[n("v-combobox",{attrs:{label:"Tipo Doc",items:e.tiposDocumento,rules:[e.rules.required]},model:{value:e.tipoDocumento,callback:function(t){e.tipoDocumento=t},expression:"tipoDocumento"}})],1),n("v-col",{attrs:{cols:"12",sm:"4"}},[n("v-text-field",{attrs:{label:"Número de documento",rules:[e.rules.required]},model:{value:e.numDoc,callback:function(t){e.numDoc=t},expression:"numDoc"}})],1),n("v-col",{attrs:{cols:"12",sm:"4"}},[n("v-text-field",{attrs:{label:"Número de teléfono",rules:[e.rules.required]},model:{value:e.tlf,callback:function(t){e.tlf=t},expression:"tlf"}})],1),n("v-col",{attrs:{cols:"12",sm:"12"}},[n("v-text-field",{attrs:{label:"Dirección"},model:{value:e.direccion,callback:function(t){e.direccion=t},expression:"direccion"}})],1)],1)],1)],1),n("v-card-actions",[n("v-spacer"),n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.close}},[e._v(" Cancelar ")]),n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.save}},[e._v(" Guardar ")])],1)],1)],1)],1),n("v-dialog",{attrs:{"max-width":"500px"},model:{value:e.dialogDelete,callback:function(t){e.dialogDelete=t},expression:"dialogDelete"}},[n("v-card",[e.actionType?n("v-card-title",{staticClass:"headline"},[e._v("¿Estás seguro de activar este item?")]):n("v-card-title",{staticClass:"headline"},[e._v("¿Estás seguro de desactivar este item?")]),n("v-card-actions",[n("v-spacer"),n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.closeDelete}},[e._v("Cancelar")]),e.actionType?n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.activateItemConfirm}},[e._v("Activar")]):n("v-btn",{attrs:{color:"blue darken-1",text:""},on:{click:e.deactivateItemConfirm}},[e._v("Desactivar")]),n("v-spacer")],1)],1)],1)],1)]},proxy:!0},{key:"item.actions",fn:function(t){var i=t.item;return[n("v-icon",{staticClass:"mr-2",attrs:{small:""},on:{click:function(t){return e.editItem(i)}}},[e._v(" mdi-pencil ")]),1===i.status?n("v-icon",{attrs:{small:""},on:{click:function(t){return e.deactivateItem(i)}}},[e._v(" mdi-cancel ")]):n("v-icon",{attrs:{small:""},on:{click:function(t){return e.activateItem(i)}}},[e._v(" mdi-check ")])]}},{key:"no-data",fn:function(){return[n("v-btn",{attrs:{color:"primary"},on:{click:e.getClientes}},[e._v(" Reset ")])]},proxy:!0},{key:"item.status",fn:function(t){var i=t.item;return[n("v-chip",{attrs:{color:e.getColor(i.status),dark:""}},[e._v(" "+e._s(e.statusName(i.status))+" ")])]}}])})],1)},s=[],a=(n("b0c0"),n("96cf"),n("1da1")),o=n("bc3a"),r=n.n(o),l={name:"Clients",data:function(){return{search:"",dialog:!1,dialogDelete:!1,headers:[{text:"Acciones",value:"actions",sortable:!1},{text:"Nombre",value:"name"},{text:"Tipo persona",value:"personType"},{text:"Tipo de documento",value:"documentType"},{text:"Número de documento",value:"documentNumber",sortable:!1},{text:"Dirección",value:"address",sortable:!1},{text:"Número de teléfono",value:"phoneNumber",sortable:!1},{text:"Correo",value:"email",sortable:!1},{text:"Estado",value:"status",align:"center"}],editedIndex:-1,defaultItem:{name:"",description:"",status:0},clientes:[],_id:"",nombre:"",tipoDocumento:"",direccion:"",numDoc:"",tlf:"",email:"",tipoPersona:"",roles:["Admin","Storekeeper","Seller"],tiposDocumento:["V","J","E"],rules:{required:function(e){return!!e||"Campo requerido"},min:function(e){return e&&e.length>=1&&e.length<=53||"El nombre debe estar entre 1 y 50 caracteres"}},valid:!1,item:null,actionType:null}},computed:{formTitle:function(){return-1===this.editedIndex?"Nuevo cliente":"Editar cliente"}},watch:{dialog:function(e){e||this.close()},dialogDelete:function(e){e||this.closeDelete()}},created:function(){this.getClientes()},methods:{getClientes:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var n,i,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,n={Token:e.$store.state.token},i={headers:n},t.next=5,r.a.get("person/list",i);case 5:s=t.sent,e.clientes=s.data,t.next=12;break;case 9:t.prev=9,t.t0=t["catch"](0),console.log(t.t0);case 12:case"end":return t.stop()}}),t,null,[[0,9]])})))()},statusName:function(e){return 1===e?"Activo":0===e?"Desactivado":"Estado desconocido"},editItem:function(e){this._id=e._id,this.nombre=e.name,this.tipoPersona=e.personType,this.tipoDocumento=e.documentType,this.numDoc=e.documentNumber,this.tlf=e.phoneNumber,this.direccion=e.address,this.email=e.email,this.editedIndex=1,this.dialog=!0},deactivateItem:function(e){this._id=e._id,this.actionType=0,this.dialogDelete=!0},activateItem:function(e){this._id=e._id,this.actionType=1,this.dialogDelete=!0},deactivateItemConfirm:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var n,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,n={Token:e.$store.state.token},i={headers:n},t.next=5,r.a.put("/person/deactivate",{_id:e._id},i);case 5:e.clean(),e.close(),e.getClientes(),t.next=13;break;case 10:t.prev=10,t.t0=t["catch"](0),console.log(t.t0);case 13:e.closeDelete();case 14:case"end":return t.stop()}}),t,null,[[0,10]])})))()},activateItemConfirm:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var n,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,n={Token:e.$store.state.token},i={headers:n},t.next=5,r.a.put("/person/activate",{_id:e._id},i);case 5:e.clean(),e.close(),e.getClientes(),t.next=13;break;case 10:t.prev=10,t.t0=t["catch"](0),console.log(t.t0);case 13:e.closeDelete();case 14:case"end":return t.stop()}}),t,null,[[0,10]])})))()},close:function(){var e=this;this.dialog=!1,this.$refs.form.resetValidation(),this.clean(),this.$nextTick((function(){e.editedIndex=-1}))},closeDelete:function(){var e=this;this.dialogDelete=!1,this.$nextTick((function(){e.editedItem=Object.assign({},e.defaultItem),e.editedIndex=-1}))},clean:function(){this._id="",this.nombre="",this.descripcion="",this.tipoPersona="",this.tipoDocumento="",this.numDoc="",this.direccion="",this.tlf="",this.email=""},save:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var n,i,s,a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(1!==e.editedIndex){t.next=18;break}if(!e.$refs.form.validate()){t.next=16;break}return t.prev=2,n={Token:e.$store.state.token},i={headers:n},t.next=7,r.a.put("/person/update",{_id:e._id,name:e.nombre,personType:e.tipoPersona,documentType:e.tipoDocumento,documentNumber:e.numDoc,address:e.direccion,phoneNumber:e.tlf,email:e.email},i);case 7:e.clean(),e.close(),e.getClientes(),t.next=15;break;case 12:t.prev=12,t.t0=t["catch"](2),console.log(t.t0);case 15:e.close();case 16:t.next=33;break;case 18:if(!e.$refs.form.validate()){t.next=33;break}return t.prev=19,s={Token:e.$store.state.token},a={headers:s},t.next=24,r.a.post("/person/add",{name:e.nombre,personType:e.tipoPersona,documentType:e.tipoDocumento,documentNumber:e.numDoc,address:e.direccion,phoneNumber:e.tlf,email:e.email},a);case 24:e.clean(),e.close(),e.getClientes(),t.next=32;break;case 29:t.prev=29,t.t1=t["catch"](19),console.log(t.t1);case 32:e.close();case 33:case"end":return t.stop()}}),t,null,[[2,12],[19,29]])})))()},getColor:function(e){return 1===e?"green":0===e?"red":"black"}}},c=l,u=n("2877"),d=n("6544"),h=n.n(d),m=n("8336"),p=n("b0af"),f=n("99d9"),v=n("cc20"),b=n("62ad"),g=n("2b5d"),I=n("a523"),x=n("8fea"),S=n("169a"),D=n("ce7e"),y=n("4bd4"),k=n("132d"),C=n("0fd9"),T=n("2fa4"),w=n("8654"),V=n("71d9"),_=n("2a7f"),O=Object(u["a"])(c,i,s,!1,null,null,null);t["default"]=O.exports;h()(O,{VBtn:m["a"],VCard:p["a"],VCardActions:f["a"],VCardText:f["b"],VCardTitle:f["c"],VChip:v["a"],VCol:b["a"],VCombobox:g["a"],VContainer:I["a"],VDataTable:x["a"],VDialog:S["a"],VDivider:D["a"],VForm:y["a"],VIcon:k["a"],VRow:C["a"],VSpacer:T["a"],VTextField:w["a"],VToolbar:V["a"],VToolbarTitle:_["a"]})},"8a79":function(e,t,n){"use strict";var i=n("23e7"),s=n("06cf").f,a=n("50c4"),o=n("5a34"),r=n("1d80"),l=n("ab13"),c=n("c430"),u="".endsWith,d=Math.min,h=l("endsWith"),m=!c&&!h&&!!function(){var e=s(String.prototype,"endsWith");return e&&!e.writable}();i({target:"String",proto:!0,forced:!m&&!h},{endsWith:function(e){var t=String(r(this));o(e);var n=arguments.length>1?arguments[1]:void 0,i=a(t.length),s=void 0===n?i:d(a(n),i),l=String(e);return u?u.call(t,l,s):t.slice(s-l.length,s)===l}})}}]);
//# sourceMappingURL=clients.2fa9e2c8.js.map