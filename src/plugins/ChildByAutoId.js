import firebase from 'firebase'

const ChildByAutoId = (child, id) => {
    let ref = firebase.database()
    const childByAutoId = ref.ref(child).child(id).push()
    return childByAutoId.key;
}

export default ChildByAutoId;