import React, { useEffect, useRef, useState } from 'react';
import { AppState } from '../Context';
import { alpha, makeStyles, AppBar, Toolbar, IconButton, Typography, InputBase, Badge, MenuItem, Menu, Button, Popper, Paper, ClickAwayListener, MenuList, Grow, Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';
import { auth } from '../Scripts/firebase-config';
import { signOut } from '@firebase/auth'
import NotificationSection from './NotificationSection';
import axios from 'axios';
import { singleCoin } from '../Scripts/api';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: '50%',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: "100%",
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '100%',
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export default function Header() {
    const { user, notifications, setValue, coins, setCoin, setAlert } = AppState();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [displaySearch, SetDisplaySearch] = useState(false);
    const [searchResult, setSearchResult] = useState([])

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const [showNotificationSection, setshowNotificationSection] = useState(false);
    const notificationstoShow = notifications.filter((item) => item.show === true);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        SetDisplaySearch(false);
        document.querySelector("#search-box").value = "";
    };

    const handleSearch = () => {
        // console.log(coins);
        if (searchText.trim() === "" || searchText.length < 2) {
            SetDisplaySearch(false);
        } else {
            SetDisplaySearch(true);
            setSearchResult(coins.find(data => data?.contract_address?.toLowerCase() === searchText.toLocaleLowerCase()))

        }
    }

    const logOut = () => {
        signOut(auth);
        setAlert({
            open: true,
            time: 3000,
            type: "success",
            message: `Logged out User`,
        });
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); logOut() }}>Logout</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={() => setshowNotificationSection(true)}>
                <IconButton aria-label={"show " + notificationstoShow.length + 1 + "new notifications"} color="inherit">
                    <Badge badgeContent={notificationstoShow.length + 1} color="secondary" overlap='rectangular'>
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
                <p>Notifications</p>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar
                        style={{
                            height: 28,
                            width: 28,
                            cursor: "pointer",
                            backgroundColor: "var(--main-color)"
                        }}
                        src={user?.photoURL}
                        alt={user?.displayName || user?.email}
                    />
                </IconButton>
                <p>More</p>
            </MenuItem>
        </Menu>
    );

    const searchResults = (
        <ClickAwayListener onClickAway={handleClose}>

            <ul className='search-results' style={{ zIndex: "2", display: displaySearch ? 'block' : 'none' }}>
                {
                    searchResult ?
                        <li key={searchResult.id} onClick={() => { setCoin(searchResult.id); setValue(0); handleClose() }} >{searchResult.name}<small style={{ color: "var(--main-color)", margin: "0px 10px" }}>{searchResult.symbol}</small></li>
                        :
                        <Typography variant='h6' align='center' color='primary' mx="auto" style={{ fontWeight: "900", fontSize: "0.8rem" }}>Does not exist</Typography>
                }
            </ul>
        </ClickAwayListener>
    );

    useEffect(() => {
        handleSearch();
    }, [searchText]);
    return (
        <div className={classes.grow}>
            <AppBar color='transparent' position="static">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        <Link to='/'>
                            X Tracker
                        </Link>
                    </Typography>
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search by Contract Address…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                            id="search-box"
                            onChange={(e) => {
                                setSearchText(e.target.value);
                                handleSearch();
                            }}
                            autoComplete="off"

                        />
                        {searchResults}
                    </div>

                    <div className={classes.grow} />
                    {user ?
                        <>
                            <div className={classes.sectionDesktop}>
                                <IconButton aria-label={"show " + notificationstoShow.length + 1 + "new notifications"} color="inherit" onClick={() => setshowNotificationSection(true)}>
                                    <Badge badgeContent={notificationstoShow.length + 1} color="secondary" overlap='rectangular'>
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit"
                                >
                                    <Avatar
                                        style={{
                                            height: 38,
                                            width: 38,
                                            cursor: "pointer",
                                            backgroundColor: "var(--main-color)"
                                        }}
                                        src={user?.photoURL}
                                        alt={user?.displayName || user?.email}
                                    />
                                </IconButton>
                            </div>
                            <div className={classes.sectionMobile}>
                                <IconButton
                                    aria-label="show more"
                                    aria-controls={mobileMenuId}
                                    aria-haspopup="true"
                                    onClick={handleMobileMenuOpen}
                                    color="inherit"
                                >
                                    <MoreIcon />
                                </IconButton>
                            </div>
                        </>
                        :
                        <>
                            <AuthModal />
                        </>
                    }

                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
            {showNotificationSection && <NotificationSection setshowNotificationSection={setshowNotificationSection} />}

        </div>
    );
}
