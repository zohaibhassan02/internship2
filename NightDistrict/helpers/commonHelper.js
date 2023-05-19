import mongoose from "mongoose";
import order_model from '../models/order.js'

function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        return dist;
    }
}

function regexSearch(query) {
    let search = '.*' + query + '.*';
    let value = new RegExp(["^", search, "$"].join(""), "i");
    return value;
}

function removeAlphabat(str) {
    let value = str.toString();
    return value;
}

function pagination(page, limit, records) {
    const results = {};
    limit = limit == 0 ? 5 : limit;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    if (endIndex < records.length) {
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
    results.totalPages = {
        page: Math.ceil(records.length / limit),
        limit: limit,
        totalRecords: records.length
    };
    results.result = records.slice(startIndex, endIndex);
    return results;
}

function orderNumber(order_id) {
    order_id++;
    if (order_id == 0) {
        order_id = 1;
    }
    var number = "" + order_id;
    var pad = "0000"
    var response = pad.substring(0, pad.length - number.length) + number
    return response;
}

function getDate() {
    var datetime = new Date();
    datetime = datetime.toISOString().slice(0, 10);
    return datetime;
}

function reactionsArray(arr, res) {
    if (arr.length != 0) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].trackid == res.spotifytrackId) {
                const index = arr[i].users.indexOf(res.id);
                if (index > -1) {
                    arr[i].users = arr[i].users.filter(function (item) {
                        return item !== res.id
                    })

                    var count = arr[i].users.length;
                    return count;
                }
                else {
                    arr[i].users.push(res.id);
                    var count = arr[i].users.length;
                    return count;
                }
                break;
            }
            else {
                const obj = {
                    trackid: res.spotifytrackId,
                    users: [res.id]
                }
                arr.push(obj);
                var count = arr[arr.length - 1].users.length
                return count;
            }
        }
    }
    else {
        const obj = {
            trackid: res.spotifytrackId,
            users: [res.id]
        }
        arr.push(obj);
        var count = arr[arr.length - 1].users.length
        return count;
    }
}


export default {
    distance,
    regexSearch,
    pagination,
    removeAlphabat,
    orderNumber,
    getDate,
    reactionsArray

}