// O OBJECTIVO DESTA FUNÇÃO É COM APENAS O NOME TER UM ARRAY BINARIO COM 21 OU 28 UNIDADES (DEPENDENDO DA TOMA DA UTILIZADORA)

/* ESTA FUNÇÃO VAI SER UTILIZADA:
    - POST REQUEST MAL A UTILIZADORA ENTRA NA APP.
    - VIA SOKETS SEMPRE QUE O BUTÃO É CLICADO. 
 */

/* 

Passo 1: Tendo o nome ir á base de dados buscar o resto da informação da utilizadora!

Passo 2: Clicks.ForEach(click, ()=>{
    // Criar uma nova data
    //Ir buscar os milisecs
    //guardar num objecto Clicks_m            {a estrutura será {click:click_milisecond}} => objectivo disto era guardar num toolkit adata em que cada dia clicou!
}) ==> todos os milisecs de todos os clicks

Passo 3: Ir buscar a Data atual; Data do inicio do dia Atual; Data do inicio do ciclo!; Data do inicio do dia do inicio do ciclo

Passo 4: while(a <= b)
    // var Intervalo = [a-milisecs de um dia, a]
    //guardar no array Intervalos_m
})==> todos os intervalos em milisecs dos dias desde o inicio do ciclo (em que array.lenght é o numero de dias do ciclo)
a= millisecs(Data_inicio_dia)
b = milisecs(Data do inicio do dia do inicio do ciclo)

Passo 5: Inicializar um array de 21 possições ou 28 dependendo da utilizadora

Passo 6: Com os dois arrays prencher o mesmo:
        // Intervalos_m.ForEach( intervalo,()=>{

            Clicks_m.foreach( click, () =>{

                if (click belong to intervalo){
                    Dias_validados => push true!
                    Passa para proximo intervalo!
                } else{continue;}
            }
            )
        }

        )

Passo 7: finalmente o array Dias_validados é o resultado! Este passo é sobre perceber como  traduzimos este array para as imagens em react!

*/
