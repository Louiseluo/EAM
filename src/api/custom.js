/**
 * Created by kangping on 2017/11/20.
 */
//这里是公用的枚举：

let cs = {
    data: {
        token: '_pandora_p_acc_'
    },

    spareParts_unit: function (x) {
        if (x == 0) {
      return "通用计量单位"
        }
        else if(x==1){
            return "生产计量单位"
        }
        else if(x==2){
            return "仓储计量单位"
        }
        else if(x==3){
            return "运输计量单位"
        }
        else if(x==4){
            return "检验计量单位"
        }
        else if(x==5){
            return "销售计量单位"
        };
    },

}

export default cs;
