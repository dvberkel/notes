function(doc) {
    if (doc.collection == 'notes' && doc.active) {
	emit([doc.collection, doc.user], doc);
    }
}