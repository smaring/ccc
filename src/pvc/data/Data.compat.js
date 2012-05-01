pvc.data.Data
.add(/** @lends pvc.data.Data# */{
    /**
     * Returns some information on the data points
     */
    getInfo: function(){

        var out = ["\n------------------------------------------"];
        out.push("Dataset Information");
        
        def.eachOwn(this.dimensions(), function(dimension, name){
            var count = dimension.count(),
                type = dimension.type,
                features = [];
            
            features.push(type.valueTypeName);
            if(type.isComparable) features.push("comparable");
            if(!type.isDiscrete) features.push("continuous");
            
            out.push(
                "  " + 
                name +
                " (" + features.join(', ') + ")" +
                " (" + count + ")\n\t" + 
                dimension.atoms().slice(0, 10).map(function(atom){ return atom.label; }).join(", ") + 
                (count > 10 ? "..." : ""));
        });
        
        out.push("------------------------------------------");

        return out.join("\n");
    },
    
    /**
     * Returns the values for the dataset
     * BoxPlot, DataTree, ParallelCoordinates
     * 
     * @deprecated
     */
    getValues: function(){
        /**
         * Values is the inner Vs matrix
         *  X | S1  | ... | S2  |
         * ----------------------
         * C1 | V11 | ... | VN1 |
         *  . |   .           .
         * CJ | V1J | ... | VNJ |
         */
         return pv.range(0, this.getCategoriesSize())
                  .map(function(categIndex){
                      return this._getValuesForCategoryIndex(categIndex);
                  }, this);
    },
    
    /**
     * Returns the unique values of a given dimension.
     * 
     * @deprecated
     */
    _getDimensionValues: function(name){
        return this.dimensions(name).atoms().map(function(atom){ return atom.value; });
    },

    /**
     * Returns the unique visible values of a given dimension.
     * 
     * @deprecated
     */
    _getDimensionVisibleValues: function(name){
        return this.dimensions(name).atoms({visible: true}).map(function(atom){ return atom.value; });
    },
    
    /**
     * Returns the unique series values.
     * @deprecated
     */
    getSeries: function(){
        return this._getDimensionValues('series');
    },

    /**
     * Returns an array with the indexes of the visible series values.
     * @deprecated
     */
    getVisibleSeriesIndexes: function(){
        return this.dimensions('series').indexes({visible: true});
    },
    
    /**
     * Returns an array with the indexes of the visible category values.
     * @deprecated
     */
    getVisibleCategoriesIndexes: function(){
        return this.dimensions('category').indexes({visible: true});
    },

    /**
     * Returns an array with the visible categories.
     * @deprecated
     */
    getVisibleSeries: function(){
        return this._getDimensionVisibleValues('series');
    },

    /**
     * Returns the categories on the underlying data
     * @deprecated
     */
    getCategories: function(){
        return this._getDimensionValues('category');
    },

    /**
     * Returns an array with the visible categories.
     * 
     * @deprecated
     */
    getVisibleCategories: function(){
        return this._getDimensionVisibleValues('category');
    },
    
    /**
     * Returns the visible values for a given series index.
     * Bullet and Pie
     * @deprecated
     */
    getVisibleValuesForSeriesIndex: function(seriesIdx){
        var seriesAtom = this.dimensions('series').atoms()[seriesIdx];
        var datumsByCategKey = this.datums({series: seriesAtom}, {visible: true})
                                   .uniqueIndex(function(datum){ return datum.atoms.category.key; });
        
        // Sorted "visible" category atoms
        return this.dimensions('category')
                   .atoms({visible: true})
                   .map(function(atom){
                        var datum = def.getOwn(datumsByCategKey, atom.key);
                        return datum ? datum.atoms.value.value : null;
                    });
    },
    
    /**
     * Returns the values for a given category index
     * @deprecated
     */
    _getValuesForCategoryIndex: function(categIdx){
        var categAtom = this.dimensions('category').atoms()[categIdx];
        var datumsBySeriesKey = this.datums({category: categAtom})
                                    .uniqueIndex(function(datum){ return datum.atoms.series.key; });
        
        // Sorted series atoms
        return this.dimensions('series')
                   .atoms()
                   .map(function(atom){
                        var datum = def.getOwn(datumsBySeriesKey, atom.key);
                        return datum ? datum.atoms.value.value : null;
                    });
    },
    
    /**
     * Returns the visible values for a given category index
     * @deprecated
     */
    getVisibleValuesForCategoryIndex: function(categIdx){
        var categAtom = this.dimensions('category').atoms()[categIdx];
        var datumsBySeriesKey = this.datums({category: categAtom}, {visible: true})
                                    .uniqueIndex(function(datum){ return datum.atoms.series.key; });
        
        // Sorted "visible" series atoms
        return this.dimensions('series')
                   .atoms({visible: true})
                   .map(function(atom){
                        var datum = def.getOwn(datumsBySeriesKey, atom.key);
                        return datum ? datum.atoms.value.value : null;
                    });
    },
    
    /**
     * Returns the transposed values for the visible dataset.
     * HeatGrid and Stacked Lines and Bars
     * @deprecated
     */
    getVisibleTransposedValues: function(){
        return this.getVisibleSeriesIndexes().map(function(seriesIndex){
            return this.getVisibleValuesForSeriesIndex(seriesIndex);
        }, this);
    },

    /**
     * Returns how many series we have
     * @deprecated
     */
    getSeriesSize: function(){
        var dim = this.dimensions('series', {assertExists: false});
        return dim ? dim.count() : 0;
    },

    /**
     * Returns how many categories, or data points, we have
     * @deprecated
     */
    getCategoriesSize: function(){
        var dim = this.dimensions('category', {assertExists: false});
        return dim ? dim.count() : 0;
    }
});