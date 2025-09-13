import React from "react";
import Productpage from '../../components/productpage.js';

export default function Productview({ params}) {
    const { prodid } = params;
    return <Productpage prodid={prodid} />;
}