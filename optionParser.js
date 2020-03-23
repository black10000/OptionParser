/** @format */

class OptionParser {
	constructor() {
		this.flagList=[];
		this.optionList=[];
		this.optionResult=[];
	}

	addStringOption(flags) {
		// TODO - add white space separated flag list (long and short flags)
		var flagarr=flags.split(' ');
		var flag={'short':flagarr[0],'long':flagarr[1],'value':'',type:'string'}
		this.optionList.push(flag);
	}

	addBoolOption(flags) {
		// TODO - add white space separated flag list (long and short flags)
		var flagarr=flags.split(' ');
		var flag={'short':flagarr[0],'long':flagarr[1],'value':false,type:'bool'}
		this.optionList.push(flag);
	}

	isSet(flag) {
		// TODO - return true if a flag (bool or string) was set
		if(this.flagList.length<=0)return false;
		let v=this.flagList.find((element)=>{
			return (element.short==flag||element.long==flag)
		});
		return v==undefined?false:true;
	}

	get(flag) {
		// TODO - return first string argument for flag
		var retult= this.flagList.find((element)=>{
			return (element.short==flag||element.long==flag)
		});
		return retult?retult.value:"";
	}

	getAll(flag) {
		// TODO - return all string arguments for flag=
		let result=[];
		this.flagList.forEach(element => {
			if(element.short==flag||element.long==flag){
				result.push(element.value)
			}
		});
		return result;
	}

	reset() {
		// TODO  - unsets all flags
		this.flagList=[];
		this.optionResult=[];
	}

	parse(args) {
		// TODO - parse command line arguments
		let count=0;
		let skip=false;
		this.optionList=this.optionList.sort().reverse();
		args.forEach(_arg => {
			count++;
			if(skip)
			{
				skip=false;
			}else{
				var isLong=undefined;
				var option=this.optionList.find((opt)=>{
					_arg.includes("-"+opt.long)?isLong=true:_arg.includes("-"+opt.short)?isLong=false:isLong=undefined;
					return _arg.includes("-"+opt.long)||_arg.includes("-"+opt.short);
				});
				if(isLong==undefined){
					this.optionResult.push(_arg);
				}
				else if(!isLong){
					if(option.type=='bool'){
						let booloptions=[];
						this.optionList.forEach(f => {
							if(f.type=='bool'){
								booloptions.push(f);
							}
						});
						_arg.split('').forEach(a => {
							let another=booloptions.find((bopt)=>{
								return (a==bopt.short&&bopt.short!=option.short)
							});
							if(another!=undefined){
								let flag=this.format(another,true,'bool');
								this.flagList.push(flag);
							}							
						});
						let flag=this.format(option,true,'bool');
						this.flagList.push(flag);
					}else{					
						skip=this.pushToFlagOptionList(option,this.valueConverter(_arg,option.short),args,count);
					}					
				}else if(isLong){
					if(option.type=='bool'){
						let flag=this.format(option,true,'bool');
						this.flagList.push(flag);
					}else{
						skip=this.pushToFlagOptionList(option,this.valueConverter(_arg,option.long),args,count);
					}					
				}
			}			
		});
		return this.optionResult;
	}
	format(option,value,type)
	{
		return {'short':option.short,'long':option.long,'value':value,type:type}
	}
	pushToFlagOptionList(option,value,args,count)
	{
		let flag=this.format(option,'','string');
		if(value==""){
			flag.value=args[count];
			this.flagList.push(flag);
			return true;
		}else if(value.charAt(0)=='='){
			flag.value=value.substring(1);
			this.flagList.push(flag);
		}else{
			flag.value=value;
			this.flagList.push(flag);
		}
		return false;
	}
	valueConverter(_arg,optionType){
		let index=_arg.indexOf("-"+optionType);
		return _arg.substring(index+optionType.length+1,_arg.length);
	}
}

module.exports = OptionParser;
