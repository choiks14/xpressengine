var Keys = {
    ENTER: 13,
    TAB: 9,
    BACKSPACE: 8,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    ESCAPE: 27
};

var PermissionInclude = React.createClass({
    displayName: 'PermissionInclude',

    propTypes: {
        selectedGroup: React.PropTypes.array,
        selectedMember: React.PropTypes.array,
        placeholder: React.PropTypes.string,
        suggestion: React.PropTypes.array,

        groups: React.PropTypes.array,
        handleGroupDelete: React.PropTypes.func.isRequired,
        handleMemberDelete: React.PropTypes.func.isRequired,
        handleAddition: React.PropTypes.func.isRequired
    },
    getDefaultProps: function () {
        return {
            placeholder: XE.Lang.trans('xe::explainIncludeUserOrGroup'),
            selectedGroup: [],
            selectedMember: [],
            groupSuggestions: [],
            memberSuggestions: []
        };
    },
    componentDidMount: function () {
    },
    getInitialState: function () {
        return {
            suggestions: [],
            groupSuggestions: [],
            memberSuggestions: [],
            query: '',
            selectedIndex: -1,
            selectionMode: false,
            searchingCnt : 0
        };
    },
    handleGroupDelete: function (i, e) {
        this.props.handleGroupDelete(i);
        this.setState({ query: '' });
    },
    handleMemberDelete: function (i, e) {
        this.props.handleMemberDelete(i);
        this.setState({ query: '' });
    },
    handleChange: function (e)
    {
        var query = e.target.value.trim();

        this.setState({
            query: query
        });

        if(query.length > 0){
            var identifier = query.substr(0, 1);
            switch (identifier){
                case "@":
                    query = query.substr(1, query.length);
                    this.searchMember(query);
                    break;
                case "%":
                    query = query.substr(1, query.length);
                    this.searchGroup(query);
                    break;
                default :
                    break;
            }
        }else{
            this.setState({
                query : '',
                suggestions : [],
                searchingCnt : 0
            });
        }
    },
    searchMember: function (keyword) {

        var searchMemberUrl = this.props.searchMemberUrl;
        var self = this;
        var searchingCnt = this.state.searchingCnt + 1;
        self.setState({
            searchingCnt : searchingCnt
        });

        $.ajax({
            url: searchMemberUrl + '/' + keyword,
            method:'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                var searchingCnt = self.state.searchingCnt;
                searchingCnt = searchingCnt - 1;
                self.setState(
                    {
                        suggestions : data,
                        searchingCnt : searchingCnt
                    }
                );
            }.bind(self),
            error: function (xhr, status, err) {
                var searchingCnt = self.state.searchingCnt;
                searchingCnt = searchingCnt - 1;
                self.setState(
                    {
                        searchingCnt : searchingCnt
                    }
                );
                console.error(searchMemberUrl, status, err.toString());
            }.bind(self)
        });

    },

    searchGroup: function (keyword) {

        var searchGroupUrl = this.props.searchGroupUrl;
        var self = this;
        var searchingCnt = this.state.searchingCnt + 1;
        self.setState({
            searchingCnt : searchingCnt
        });

        $.ajax({
            url: searchGroupUrl + '/' + keyword,
            method:'get',
            dataType: 'json',
            cache: false,
            success: function (data) {
                var searchingCnt = self.state.searchingCnt;
                searchingCnt = searchingCnt - 1;
                self.setState(
                    {
                        suggestions : data,
                        searchingCnt : searchingCnt
                    }
                );
            }.bind(self),
            error: function (xhr, status, err) {
                var searchingCnt = self.state.searchingCnt;
                searchingCnt = searchingCnt - 1;
                self.setState(
                    {
                        searchingCnt : searchingCnt
                    }
                );
                console.error(searchGroupUrl, status, err.toString());
            }.bind(self)
        });

    },

    handleKeyDown: function(e) {
        var _state = this.state;
        var query = _state.query;
        var selectedIndex = _state.selectedIndex;
        var suggestions = _state.suggestions;

        // hide suggestions menu on escape
        if (e.keyCode === Keys.ESCAPE) {
            e.preventDefault();
            this.setState({
                selectedIndex: -1,
                selectionMode: false,
                suggestions: []
            });
        }

        // when enter or tab is pressed add query to tags
        if ((e.keyCode === Keys.ENTER || e.keyCode === Keys.TAB) && query != '') {
            e.preventDefault();
            if (this.state.selectionMode) {
                this.addTag(this.state.suggestions[this.state.selectedIndex]);
            }
        }

        // when backspace key is pressed and query is blank, delete tag
        if (e.keyCode === Keys.BACKSPACE && query == '') {
            if(this.props.selectedMember.length > 0 )
                this.handleMemberDelete(this.props.selectedMember.length - 1);
            else
                this.handleGroupDelete(this.props.selectedGroup.length - 1);
        }

        // up arrow
        if (e.keyCode === Keys.UP_ARROW) {
            e.preventDefault();
            // last item, cycle to the top
            if (selectedIndex <= 0) {
                this.setState({
                    selectedIndex: this.state.suggestions.length - 1,
                    selectionMode: true
                });
            } else {
                this.setState({
                    selectedIndex: selectedIndex - 1,
                    selectionMode: true
                });
            }
        }

        // down arrow
        if (e.keyCode === Keys.DOWN_ARROW) {
            e.preventDefault();
            this.setState({
                selectedIndex: (this.state.selectedIndex + 1) % suggestions.length,
                selectionMode: true
            });
        }
    },
    addTag: function (tag) {
        var input = this.refs.input.getDOMNode();

        // call method to add
        this.props.handleAddition(tag);

        // reset the state
        this.setState({
            query: '',
            selectionMode: false,
            selectedIndex: -1
        });

        // focus back on the input box
        input.value = '';
        input.focus();
    },
    handleSuggestionClick: function(i, e) {
        this.addTag(this.state.suggestions[i]);
    },
    handleSuggestionHover: function(i, e) {
        this.setState({
            selectedIndex: i,
            selectionMode: true
        });
    },

    render: function() {
        var groupPrefix = "%";
        var memberPrefix = "@";

        var groupTagItems = this.props.selectedGroup.map((function (tag, i) {
            return (React.createElement(PermissionTag, {key: tag.id, tag: tag, prefix: groupPrefix, 
                         onDelete: this.handleGroupDelete.bind(this, i)}
                ));
        }).bind(this));

        var memberTagItems = this.props.selectedMember.map((function (tag, i) {
            return (React.createElement(PermissionTag, {key: tag.id, tag: tag, prefix: memberPrefix, 
                         onDelete: this.handleMemberDelete.bind(this, i)}
                ));
        }).bind(this));

        var query = this.state.query.trim(),
            selectedIndex = this.state.selectedIndex,

            suggestions = this.state.suggestions,
            placeholder = this.props.placeholder;

        return( React.createElement("div", {className: "ReactTags__tags"}, 
                React.createElement("div", {className: "ReactTags__selected"}, 
                    groupTagItems
                ), 
                React.createElement("div", {className: "ReactTags__selected"}, 
                    memberTagItems
                ), 
                    React.createElement("div", {className: "ReactTags__tagInput"}, 
                        React.createElement("input", {type: "text", ref: "input", placeholder: placeholder, 
                               className: "form-control", disabled: this.props.disabled, 
                               value: this.state.query, 
                               onChange: this.handleChange, onKeyDown: this.handleKeyDown}), 
                        React.createElement(PermissionTagSuggestion, {query: query, 
                            suggestions: suggestions, 
                                       searchingCnt: this.state.searchingCnt, 
                            selectedIndex: selectedIndex, 
                            handleClick: this.handleSuggestionClick, 
                            handleHover: this.handleSuggestionHover})
                    )
            )
        );
    }
});

//# sourceMappingURL=PermissionInclude.js.map
