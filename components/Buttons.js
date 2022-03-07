import React from 'react';
import { Button } from 'react-native-elements';
import Realm from 'realm';

function MainButton (props) {
	return(
	<Button
                onPress={props.func}
                title={props.text}
                buttonStyle={{
                  backgroundColor: 'rgba(78, 116, 289, 1)',
                  borderRadius: 3,			 
                }}
                containerStyle={{
                  width: 120,
                  marginHorizontal: 50,
                  marginVertical: 10,
				  marginLeft:'auto',
		          marginRight:'auto',
		          left:0,
		          right:0				
                }}
              />
	);
}

function OkButton (props) {
	return(
	<Button
                onPress={ async () => {
	            const realm = await Realm.open();
	            await realm.close();	
		        props.route.params.onReturn(1); 
		        props.nav.goBack();
	}}
                title="OK"
                buttonStyle={{
                  backgroundColor: 'rgba(78, 116, 289, 1)',
                  borderRadius: 3,			 
                }}
                containerStyle={{
                  width: 50,
                  marginTop: 15,
				  marginLeft:'auto',
		          marginRight:'auto',
		          left:0,
		          right:0				
                }}
              />
	);
}

export {MainButton, OkButton};